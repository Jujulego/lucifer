import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Machine } from './machine.entity';

// Service
@Injectable()
export class MachinesService {
  // Constructor
  constructor(
    @InjectRepository(Machine) private repository: Repository<Machine>,
  ) {}

  // Methods
  async get(ownerId: string, id: string): Promise<Machine> {
    const mch = await this.repository.findOne({
      where: { ownerId, id }
    });

    if (!mch) {
      throw new NotFoundException(`Machine ${id} not found`);
    }

    return mch;
  }

  async list(ownerId: string): Promise<Machine[]> {
    return await this.repository.find({
      where: { ownerId }
    });
  }
}
