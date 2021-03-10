import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { createProjectSchema, ICreateProject, IUpdateProject, updateProjectSchema } from '@lucifer/types';
import { ScopeGuard, Scopes } from '../auth/scope.guard';
import { YupPipe } from '../utils/yup.pipe';

import { Project } from './project.entity';
import { ProjectsService } from './projects.service';

// Controller
@Controller('/projects')
@UseGuards(AuthGuard('jwt'), ScopeGuard)
//@AllowIf((req, token) => [token.sub, 'me'].includes(req.params.userId))
export class ProjectsController {
  // Constructor
  constructor(
    private readonly projects: ProjectsService
  ) {}

  // Endpoints
  @Post('/')
  @Scopes('create:projects')
  async create(
    @Body(new YupPipe(createProjectSchema)) data: ICreateProject
  ): Promise<Project> {
    return await this.projects.create(data);
  }

  @Get('/')
  @Scopes('read:projects')
  async list(): Promise<Project[]> {
    return await this.projects.list();
  }

  @Get('/:id')
  @Scopes('read:projects')
  async get(
    @Param('id') id: string,
  ): Promise<Project> {
    return await this.projects.get(id);
  }

  @Put('/:id')
  @Scopes('update:projects')
  async update(
    @Param('id') id: string,
    @Body(new YupPipe(updateProjectSchema)) update: IUpdateProject
  ): Promise<Project> {
    return await this.projects.update(id, update);
  }

  @Delete('/:id')
  @Scopes('delete:projects')
  async delete(
    @Param('id') id: string,
  ): Promise<number | null> {
    return await this.projects.delete([id]);
  }

  @Delete('/')
  @Scopes('delete:projects')
  async bulkDelete(
    @Query('ids', ParseArrayPipe) ids: string[],
  ): Promise<number | null> {
    return await this.projects.delete(ids);
  }
}
