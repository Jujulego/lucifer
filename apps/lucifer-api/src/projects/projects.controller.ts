import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { createProjectSchema, ICreateProject, IUpdateProject, updateProjectSchema } from '@lucifer/types';
import { AllowIf, ScopeGuard, Scopes } from '../auth/scope.guard';
import { UserId } from '../users/user-id.param';
import { YupPipe } from '../utils/yup.pipe';

import { Project } from './project.entity';
import { ProjectsService } from './projects.service';

// Controller
@Controller('/:userId/projects')
@UseGuards(AuthGuard('jwt'), ScopeGuard)
@AllowIf((req, token) => [token.sub, 'me'].includes(req.params.userId))
export class ProjectsController {
  // Constructor
  constructor(
    private readonly projects: ProjectsService
  ) {}

  // Endpoints
  @Post('/')
  @Scopes('create:projects')
  async create(
    @UserId('userId') userId: string,
    @Body(new YupPipe(createProjectSchema)) data: ICreateProject
  ): Promise<Project> {
    return await this.projects.create(userId, data);
  }

  @Get('/')
  @Scopes('read:projects')
  async list(
    @UserId('userId') userId: string,
  ): Promise<Project[]> {
    return await this.projects.list(userId);
  }

  @Get('/:id')
  @Scopes('read:projects')
  async get(
    @UserId('userId') userId: string,
    @Param('id') id: string,
  ): Promise<Project> {
    return await this.projects.get(userId, id);
  }

  @Put('/:id')
  @Scopes('update:projects')
  async update(
    @UserId('userId') userId: string,
    @Param('id') id: string,
    @Body(new YupPipe(updateProjectSchema)) update: IUpdateProject
  ): Promise<Project> {
    return await this.projects.update(userId, id, update);
  }

  @Delete('/:id')
  @Scopes('delete:projects')
  async delete(
    @UserId('userId') userId: string,
    @Param('id') id: string,
  ): Promise<number | null> {
    return await this.projects.delete(userId, [id]);
  }

  @Delete('/')
  @Scopes('delete:projects')
  async bulkDelete(
    @UserId('userId') userId: string,
    @Query('ids', ParseArrayPipe) ids: string[],
  ): Promise<number | null> {
    return await this.projects.delete(userId, ids);
  }
}
