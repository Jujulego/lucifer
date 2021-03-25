import { Module } from '@nestjs/common';

import { ProjectsDataModule } from '../projects/projects-data.module';

import { UsersDataModule } from './users-data.module';
import { UsersController } from './users.controller';

// Module
@Module({
  imports: [
    ProjectsDataModule,
    UsersDataModule
  ],
  controllers: [
    UsersController
  ]
})
export class UsersModule {}
