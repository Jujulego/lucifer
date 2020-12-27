import { Body, Controller, Get, Param, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AllowIf, ScopeGuard, Scopes } from '../auth/scope.guard';

import { Machine } from './machine.entity';
import { MachinesService } from './machines.service';
import { CreateMachine } from './machine.schema';

// Controller
@Controller('/:ownerId/machines')
@UseGuards(AuthGuard('jwt'), ScopeGuard)
@AllowIf((req, token) => req.params.ownerId === token.sub)
export class MachinesController {
  // Constructor
  constructor(
    private machines: MachinesService
  ) {}

  // Endpoints
  @Post('/')
  @Scopes('create:machines')
  async create(
    @Param('ownerId') ownerId: string,
    @Body(ValidationPipe) data: CreateMachine
  ): Promise<Machine> {
    return await this.machines.create(ownerId, data)
  }

  @Get('/:id')
  @Scopes('read:machines')
  async get(
    @Param('ownerId') ownerId: string,
    @Param('id') id: string
  ): Promise<Machine> {
    return await this.machines.get(ownerId, id);
  }

  @Get('/')
  @Scopes('read:machines')
  async list(
    @Param('ownerId') ownerId: string
  ): Promise<Machine[]> {
    return await this.machines.list(ownerId);
  }
}
