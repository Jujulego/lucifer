import { Body, Controller, Get, Param, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ScopeGuard } from '../auth/scope.guard';

import { Machine } from './machine.entity';
import { MachinesService } from './machines.service';
import { CreateMachine } from './machine.schema';

// Controller
@Controller('/:ownerId/machines')
@UseGuards(AuthGuard('jwt'), ScopeGuard)
export class MachinesController {
  // Constructor
  constructor(
    private machines: MachinesService
  ) {}

  // Endpoints
  @Post('/')
  async create(
    @Param('userId') ownerId: string,
    @Body(ValidationPipe) data: CreateMachine
  ): Promise<Machine> {
    return await this.machines.create(ownerId, data)
  }

  @Get('/:id')
  async get(
    @Param('ownerId') ownerId: string,
    @Param('id') id: string
  ): Promise<Machine> {
    return await this.machines.get(ownerId, id);
  }

  @Get('/')
  async list(
    @Param('ownerId') ownerId: string
  ): Promise<Machine[]> {
    return await this.machines.list(ownerId);
  }
}
