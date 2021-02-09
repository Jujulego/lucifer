import { Module } from '@nestjs/common';

import { ProjectsController } from './projects.controller';
import { ProjectsDataModule } from './projects-data.module';
import { VariablesModule } from './variables/variables.module';

// Module
@Module({
  imports: [
    ProjectsDataModule,
    VariablesModule
  ],
  controllers: [
    ProjectsController
  ]
})
export class ProjectsModule {}
