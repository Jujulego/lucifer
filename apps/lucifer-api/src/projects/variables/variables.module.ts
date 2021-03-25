import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Variable } from './variable.entity';
import { VariablesService } from './variables.service';
import { VariablesController } from './variables.controller';
import { ProjectsDataModule } from '../projects-data.module';

// Module
@Module({
  imports: [
    ProjectsDataModule,
    TypeOrmModule.forFeature([Variable])
  ],
  providers: [
    VariablesService
  ],
  controllers: [
    VariablesController
  ]
})
export class VariablesModule {}
