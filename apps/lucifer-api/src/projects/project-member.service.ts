import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UsersService } from '../users/users.service';

import { ProjectMember } from './project-member.entity';

// Service
@Injectable()
export class ProjectMemberService {
  // Constructor
  constructor(
    private users: UsersService,
    @InjectRepository(ProjectMember) private repository: Repository<ProjectMember>
  ) {}

  // Methods
  async add(projectId: string, userId: string, admin = false): Promise<ProjectMember> {
    // Create project member
    const mmb = this.repository.create({
      projectId,
      userId,
      admin
    });

    return await this.repository.save(mmb);
  }

  async find(userId: string, projectId: string): Promise<ProjectMember | null> {
    const mmb = await this.repository.findOne({
      where: { userId, projectId }
    });

    return mmb || null;
  }

  async get(userId: string, projectId: string): Promise<ProjectMember> {
    const mmb = await this.find(userId, projectId);

    if (!mmb) {
      throw new NotFoundException(`${userId} is not member of ${projectId}`);
    }

    return mmb;
  }
}
