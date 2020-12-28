import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe, ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AllowIf, ScopeGuard, Scopes } from '../auth/scope.guard';

import { Machine } from './machine.entity';
import { MachinesService } from './machines.service';
import { CreateMachine, UpdateMachine } from './machine.schema';

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

  @Get('/')
  @Scopes('read:machines')
  async list(
    @Param('ownerId') ownerId: string
  ): Promise<Machine[]> {
    return await this.machines.list(ownerId);
  }

  @Delete('/')
  @Scopes('delete:machines')
  async bulkDelete(
    @Param('ownerId') ownerId: string,
    @Query('id', ParseArrayPipe) ids: string[],
  ): Promise<number | null> {
    return await this.machines.delete(ownerId, ids);
  }

  @Get('/:id')
  @Scopes('read:machines')
  async get(
    @Param('ownerId') ownerId: string,
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<Machine> {
    return await this.machines.get(ownerId, id);
  }

  @Put('/:id')
  @Scopes('update:machines')
  async update(
    @Param('ownerId') ownerId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) update: UpdateMachine,
  ): Promise<Machine> {
    return await this.machines.update(ownerId, id, update);
  }

  @Delete('/:id')
  @Scopes('delete:machines')
  async delete(
    @Param('ownerId') ownerId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<number | null> {
    return await this.machines.delete(ownerId, [id]);
  }
}
