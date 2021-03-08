import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../../users/users.module';

import { Variable } from './variable.entity';
import { VariablesService } from './variables.service';
import { VariablesController } from './variables.controller';
import { ProjectsDataModule } from '../projects-data.module';

// Module
@Module({
  imports: [
    TypeOrmModule.forFeature([Variable]),
    ProjectsDataModule,
    UsersModule
  ],
  providers: [
    VariablesService
  ],
  controllers: [
    VariablesController
  ]
})
export class VariablesModule {}
