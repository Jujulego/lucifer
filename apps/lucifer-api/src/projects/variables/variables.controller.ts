import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { createVariableSchema, ICreateVariable, IUpdateVariable, updateVariableSchema } from '@lucifer/types';
import { ScopeGuard, Scopes } from '../../auth/scope.guard';
import { UserId } from '../../users/user-id.param';
import { YupPipe } from '../../utils/yup.pipe';

import { Variable } from './variable.entity';
import { VariablesService } from './variables.service';

// Controller
@Controller('/projects/:projectId/variables')
@UseGuards(AuthGuard('jwt'), ScopeGuard)
//@AllowIf((req, token) => [token.sub, 'me'].includes(req.params.userId))
export class VariablesController {
  // Constructor
  constructor(
    private readonly variables: VariablesService
  ) {}

  // Endpoints
  @Post('/')
  @Scopes('create:variables')
  async create(
    @Param('projectId') projectId: string,
    @Body(new YupPipe(createVariableSchema)) data: ICreateVariable
  ): Promise<Variable> {
    return await this.variables.create(projectId, data);
  }

  @Get('/')
  @Scopes('read:variables')
  async list(
    @Param('projectId') projectId: string,
  ): Promise<Variable[]> {
    return await this.variables.list(projectId);
  }

  @Put('/:id')
  @Scopes('update:variables')
  async update(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body(new YupPipe(updateVariableSchema)) update: IUpdateVariable
  ): Promise<Variable> {
    return await this.variables.update(projectId, id, update);
  }

  @Delete('/:id')
  @Scopes('delete:variables')
  async delete(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ): Promise<number | null> {
    return await this.variables.delete(projectId, [id]);
  }

  @Delete('/')
  @Scopes('delete:variables')
  async bulkDelete(
    @UserId('userId') userId: string,
    @Param('projectId') projectId: string,
    @Query('ids', ParseArrayPipe) ids: string[],
  ): Promise<number | null> {
    return await this.variables.delete(projectId, ids);
  }
}
