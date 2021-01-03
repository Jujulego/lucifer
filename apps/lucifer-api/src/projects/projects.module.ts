import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';

import { Project } from './project.entity';

// Module
@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    UsersModule
  ]
})
export class ProjectsModule {}
