import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';

import { Project } from './project.entity';
import { ProjectsService } from './projects.service';

// Module
@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    UsersModule
  ],
  providers: [
    ProjectsService
  ]
})
export class ProjectsModule {}
