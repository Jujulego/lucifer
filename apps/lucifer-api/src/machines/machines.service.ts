import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { UsersService } from '../users/users.service';

import { Machine } from './machine.entity';
import { CreateMachine, UpdateMachine } from './machine.schema';

// Service
@Injectable()
export class MachinesService {
  // Constructor
  constructor(
    private users: UsersService,
    @InjectRepository(Machine) private repository: Repository<Machine>,
  ) {}

  // Methods
  async create(ownerId: string, data: CreateMachine) {
    // Ensure user exists
    await this.users.getLocal(ownerId);

    // Create machine
    const mch = this.repository.create({
      ...data,
      ownerId
    });

    return await this.repository.save(mch);
  }

  async list(ownerId: string): Promise<Machine[]> {
    return await this.repository.find({
      where: { ownerId }
    });
  }

  async get(ownerId: string, id: string): Promise<Machine> {
    const mch = await this.repository.findOne({
      where: { ownerId, id }
    });

    if (!mch) {
      throw new NotFoundException(`Machine ${id} not found`);
    }

    return mch;
  }

  async update(ownerId: string, id: string, update: UpdateMachine): Promise<Machine> {
    const mch = await this.get(ownerId, id);

    // Apply update
    if (update.shortName) mch.shortName = update.shortName;

    return await this.repository.save(mch);
  }

  async delete(ownerId: string, ids: string[]): Promise<number | null> {
    const { affected } = await this.repository.delete({ ownerId, id: In(ids) });
    return affected ?? null;
  }
}
