import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { ICreateProject, IUpdateProject } from '@lucifer/types';
import { Context } from '../context';
import { UsersService } from '../users/users.service';

import { Project } from './project.entity';
import { ProjectMemberService } from './project-member.service';

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
      where: { id }
    });

    return prj || null;
  }

  async create(ctx: Context, data: ICreateProject): Promise<Project> {
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
    await this.members.add(prj.id, ctx.user.sub, true);

    return prj;
  }

  async list(): Promise<Project[]> {
    return await this.repository.find();
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
    const { affected } = await this.repository.delete({ id: In(ids) });
    return affected ?? null;
  }
}
