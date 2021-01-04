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

import { AllowIf, ScopeGuard, Scopes } from '../auth/scope.guard';

import { Project } from './project.entity';
import { CreateProject, UpdateProject } from './project.schema';
import { ProjectsService } from './projects.service';

// Controller
@Controller('/:adminId/projects')
@UseGuards(AuthGuard('jwt'), ScopeGuard)
@AllowIf((req, token) => req.params.adminId === token.sub)
export class ProjectsController {
  // Constructor
  constructor(
    private readonly projects: ProjectsService
  ) {}

  // Endpoints
  @Post('/')
  @Scopes('create:projects')
  async create(
    @Param('adminId') adminId: string,
    @Body(ValidationPipe) data: CreateProject
  ): Promise<Project> {
    return await this.projects.create(adminId, data);
  }

  @Get('/')
  @Scopes('read:projects')
  async list(
    @Param('adminId') adminId: string,
  ): Promise<Project[]> {
    return await this.projects.list(adminId);
  }

  @Get('/:id')
  @Scopes('read:projects')
  async get(
    @Param('adminId') adminId: string,
    @Param('id') id: string,
  ): Promise<Project> {
    return await this.projects.get(adminId, id);
  }

  @Put('/:id')
  @Scopes('update:projects')
  async update(
    @Param('adminId') adminId: string,
    @Param('id') id: string,
    @Body(ValidationPipe) update: UpdateProject
  ): Promise<Project> {
    return await this.projects.update(adminId, id, update);
  }

  @Delete('/:id')
  @Scopes('delete:projects')
  async delete(
    @Param('adminId') adminId: string,
    @Param('id') id: string,
  ): Promise<number | null> {
    return await this.projects.delete(adminId, [id]);
  }

  @Delete('/')
  @Scopes('delete:projects')
  async bulkDelete(
    @Param('adminId') adminId: string,
    @Query('ids', ParseArrayPipe) ids: string[],
  ): Promise<number | null> {
    return await this.projects.delete(adminId, ids);
  }
}
