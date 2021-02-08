import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { ICreateProject, IUpdateProject } from '@lucifer/types';
import { UsersService } from '../users/users.service';

import { Project } from './project.entity';

// Service
@Injectable()
export class ProjectsService {
  // Constructor
  constructor(
    private users: UsersService,
    @InjectRepository(Project) private repository: Repository<Project>
  ) {}

  // Methods
  private async _get(adminId: string, id: string): Promise<Project | null> {
    const prj = await this.repository.findOne({
      where: { adminId, id }
    });

    return prj || null;
  }

  async create(adminId: string, data: ICreateProject): Promise<Project> {
    // Ensure user exists
    await this.users.getLocal(adminId);

    // Check if id does not exists
    let prj = await this._get(adminId, data.id);
    if (prj) {
      throw new ConflictException(`Project with id ${data.id} already exists`);
    }

    // Create new project
    prj = this.repository.create({
      ...data,
      adminId
    });

    return await this.repository.save(prj);
  }

  async list(adminId: string): Promise<Project[]> {
    return await this.repository.find({
      where: { adminId }
    });
  }

  async get(adminId: string, id: string): Promise<Project> {
    const prj = await this._get(adminId, id);

    if (!prj) {
      throw new NotFoundException(`Project ${id} not found`);
    }

    return prj;
  }

  async update(adminId: string, id: string, update: IUpdateProject): Promise<Project> {
    const prj = await this.get(adminId, id);

    // Apply update
    prj.name        = update.name        ?? prj.name;
    prj.description = update.description ?? prj.description;

    return await this.repository.save(prj);
  }

  async delete(adminId: string, ids: string[]): Promise<number | null> {
    const { affected } = await this.repository.delete({ adminId, id: In(ids) });
    return affected ?? null;
  }
}
