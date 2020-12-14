import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ScopeGuard } from '../auth/scope.guard';

import { Machine } from './machine.entity';
import { MachinesService } from './machines.service';

// Controller
@Controller('/:userId/machines')
@UseGuards(AuthGuard('jwt'), ScopeGuard)
export class MachinesController {
  // Constructor
  constructor(
    private machines: MachinesService
  ) {}

  // Endpoints
  @Get('/:id')
  async get(
    @Param('userId') userId: string,
    @Param('id') id: string
  ): Promise<Machine> {
    return await this.machines.get(userId, id);
  }

  @Get('/')
  async list(
    @Param('userId') userId: string
  ): Promise<Machine[]> {
    return await this.machines.list(userId);
  }
}
