import { Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import type { ICreateProject, IProjectFilters, IUpdateProject } from '@lucifer/types';
import { createProjectSchema, projectFiltersSchema, updateProjectSchema } from '@lucifer/types';
import { ProjectIdParam, ScopeGuard, Scopes } from '../auth/scope.guard';
import { Context, Ctx } from '../context';
import { YupPipe } from '../utils/yup.pipe';

import { Project } from './project.entity';
import { ProjectsService } from './projects.service';

// Controller
@Controller('/projects')
@UseGuards(AuthGuard('jwt'), ScopeGuard)
export class ProjectsController {
  // Constructor
  constructor(
    private readonly projects: ProjectsService
  ) {}

  // Endpoints
  @Post('/')
  @Scopes('create:projects')
  async create(
    @Ctx() ctx: Context,
    @Body(new YupPipe(createProjectSchema)) data: ICreateProject
  ): Promise<Project> {
    return await this.projects.create(ctx, data);
  }

  @Get('/')
  async list(
    @Ctx() ctx: Context,
    @Query(new YupPipe(projectFiltersSchema)) filters: IProjectFilters
  ): Promise<Project[]> {
    return await this.projects.list(ctx, filters);
  }

  @Get('/:id')
  @Scopes('read:projects')
  @ProjectIdParam('id')
  async get(
    @Param('id') id: string,
  ): Promise<Project> {
    return await this.projects.get(id);
  }

  @Put('/:id')
  @Scopes('update:projects')
  @ProjectIdParam('id')
  async update(
    @Param('id') id: string,
    @Body(new YupPipe(updateProjectSchema)) update: IUpdateProject
  ): Promise<Project> {
    return await this.projects.update(id, update);
  }

  @Delete('/:id')
  @Scopes('delete:projects')
  @ProjectIdParam('id')
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
