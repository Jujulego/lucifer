import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { ICreateProject, IProjectFilters, IUpdateProject } from '@lucifer/types';
import { Context } from '../context';
import { UsersService } from '../users/users.service';

import { Project } from './project.entity';
import { ProjectMemberService } from './project-member.service';
import { ProjectMember } from './project-member.entity';

// Service
@Injectable()
export class ProjectsService {
  // Constructor
  constructor(
    private users: UsersService,
    private members: ProjectMemberService,
    @InjectRepository(Project) private repository: Repository<Project>
  ) {}

  // Methods
  private async _get(id: string): Promise<Project | null> {
    const prj = await this.repository.findOne({
      where: { id },
      relations: ['members']
    });

    return prj || null;
  }

  async create(ctx: Context, data: ICreateProject): Promise<Project> {
    if (ctx.info.kind !== 'user') throw new ForbiddenException();

    // Check if id does not exists
    let prj = await this._get(data.id);
    if (prj) {
      throw new ConflictException(`Project with id ${data.id} already exists`);
    }

    // Create new project
    prj = await this.repository.save(
      this.repository.create(data)
    );

    // Add current user as admin
    prj.members = [
      await this.members.add(prj.id, ctx.info.userId, true)
    ];

    return prj;
  }

  async list(ctx: Context, filters: IProjectFilters): Promise<Project[]> {
    if (ctx.info.kind !== 'user') throw new ForbiddenException();

    // Filters
    if (filters.member === 'me') {
      filters.member = ctx.info.userId;
    }

    // Query builder
    const qb = this.repository.createQueryBuilder('project');
    qb.leftJoinAndSelect('project.members', 'member');

    // Filters
    if (!ctx.has('read:projects')) {
      qb.innerJoin(ProjectMember, 'mmb1',
        'project.id = mmb1.projectId and mmb1.userId = :self',
        { self: ctx.info.userId }
      );
    }

    if (filters.member) {
      qb.innerJoin(ProjectMember, 'mmb2',
        'project.id = mmb2.projectId and mmb2.userId = :member',
        { member: filters.member }
      );
    }

    return await qb.getMany();
  }

  async get(id: string): Promise<Project> {
    const prj = await this._get(id);

    if (!prj) {
      throw new NotFoundException(`Project ${id} not found`);
    }

    return prj;
  }

  async update(id: string, update: IUpdateProject): Promise<Project> {
    const prj = await this.get(id);

    // Apply update
    prj.name        = update.name        ?? prj.name;
    prj.description = update.description ?? prj.description;

    return await this.repository.save(prj);
  }

  async delete(ids: string[]): Promise<number | null> {
    // Delete
    const { affected } = await this.repository.delete({ id: In(ids) });
    return affected ?? null;
  }
}
