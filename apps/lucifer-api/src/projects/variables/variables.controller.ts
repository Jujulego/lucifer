import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AllowIf, ScopeGuard, Scopes } from '../../auth/scope.guard';
import { UserId } from '../../users/user-id.param';

import { Variable } from './variable.entity';
import { CreateVariable, UpdateVariable } from './variable.schema';
import { VariablesService } from './variables.service';

// Controller
@Controller('/:userId/projects/:projectId/variables')
@UseGuards(AuthGuard('jwt'), ScopeGuard)
@AllowIf((req, token) => [token.sub, 'me'].includes(req.params.userId))
export class VariablesController {
  // Constructor
  constructor(
    private readonly variables: VariablesService
  ) {}

  // Endpoints
  @Post('/')
  @Scopes('create:variables')
  async create(
    @UserId('userId') userId: string,
    @Param('projectId') projectId: string,
    @Body(ValidationPipe) data: CreateVariable
  ): Promise<Variable> {
    return await this.variables.create(userId, projectId, data);
  }

  @Get('/')
  @Scopes('read:variables')
  async list(
    @UserId('userId') userId: string,
    @Param('projectId') projectId: string,
  ): Promise<Variable[]> {
    return await this.variables.list(userId, projectId);
  }

  @Get('/:id')
  @Scopes('read:variables')
  async get(
    @UserId('userId') userId: string,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ): Promise<Variable> {
    return await this.variables.get(userId, projectId, id);
  }

  @Put('/:id')
  @Scopes('update:variables')
  async update(
    @UserId('userId') userId: string,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body(ValidationPipe) update: UpdateVariable
  ): Promise<Variable> {
    return await this.variables.update(userId, projectId, id, update);
  }

  @Delete('/:id')
  @Scopes('delete:variables')
  async delete(
    @UserId('userId') userId: string,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ): Promise<number | null> {
    return await this.variables.delete(userId, projectId, [id]);
  }

  @Delete('/')
  @Scopes('delete:variables')
  async bulkDelete(
    @UserId('userId') userId: string,
    @Param('projectId') projectId: string,
    @Query('ids', ParseArrayPipe) ids: string[],
  ): Promise<number | null> {
    return await this.variables.delete(userId, projectId, ids);
  }
}
