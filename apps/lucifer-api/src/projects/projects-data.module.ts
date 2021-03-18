import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';

import { Project } from './project.entity';
import { ProjectMember } from './project-member.entity';
import { ProjectsService } from './projects.service';
import { ProjectMemberService } from './project-member.service';

// Modules
@Module({
  imports: [
    TypeOrmModule.forFeature([Project, ProjectMember]),
    UsersModule,
  ],
  providers: [
    ProjectsService,
    ProjectMemberService
  ],
  exports: [
    ProjectsService
  ]
})
export class ProjectsDataModule {}
