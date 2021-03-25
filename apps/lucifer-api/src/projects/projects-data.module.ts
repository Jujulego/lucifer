import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersDataModule } from '../users/users-data.module';

import { Project } from './project.entity';
import { ProjectMember } from './project-member.entity';
import { ProjectsService } from './projects.service';
import { ProjectMemberService } from './project-member.service';

// Modules
@Module({
  imports: [
    TypeOrmModule.forFeature([Project, ProjectMember]),
    UsersDataModule,
  ],
  providers: [
    ProjectsService,
    ProjectMemberService
  ],
  exports: [
    ProjectsService,
    ProjectMemberService
  ]
})
export class ProjectsDataModule {}
