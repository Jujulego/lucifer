import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { ICreateVariable, IUpdateVariable } from '@lucifer/types';
import { ProjectsService } from '../projects.service';

import { Variable } from './variable.entity';

// Service
@Injectable()
export class VariablesService {
  // Constructor
  constructor(
    private projects: ProjectsService,
    @InjectRepository(Variable) private repository: Repository<Variable>
  ) {}

  // Methods
  private async _get(projectId: string, id: string): Promise<Variable | null> {
    const vrb = await this.repository.findOne({
      where: { projectId, id }
    });

    return vrb || null;
  }

  async create(projectId: string, data: ICreateVariable): Promise<Variable> {
    // Ensure project exists (throw if it does not exists)
    await this.projects.get(projectId);

    // Check if id does not exists
    let vrb = await this._get(projectId, data.id);
    if (vrb) {
      throw new ConflictException(`Variable with id ${data.id} already exists.`);
    }

    // Create new variable
    vrb = this.repository.create({
      ...data,
      projectId
    });

    return await this.repository.save(vrb);
  }

  async list(projectId: string): Promise<Variable[]> {
    return await this.repository.find({
      where: { projectId }
    });
  }

  async get(projectId: string, id: string): Promise<Variable> {
    const vrb = await this._get(projectId, id);

    if (!vrb) {
      throw new NotFoundException(`Variable ${id} not found`);
    }

    return vrb;
  }

  async update(projectId: string, id: string, update: IUpdateVariable): Promise<Variable> {
    const vrb = await this.get(projectId, id);

    // Apply update
    vrb.name  = update.name  ?? vrb.name;
    vrb.value = update.value ?? vrb.value;

    return await this.repository.save(vrb);
  }

  async delete(projectId: string, ids: string[]): Promise<number | null> {
    const { affected } = await this.repository.delete({ projectId, id: In(ids) });
    return affected ?? null;
  }
}
