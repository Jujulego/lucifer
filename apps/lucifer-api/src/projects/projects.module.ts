import { Module } from '@nestjs/common';

import { ApiKeyModule } from './api-keys/api-key.module';
import { ProjectsDataModule } from './projects-data.module';
import { VariablesModule } from './variables/variables.module';
import { ProjectsController } from './projects.controller';

// Module
@Module({
  imports: [
    ApiKeyModule,
    ProjectsDataModule,
    VariablesModule
  ],
  controllers: [
    ProjectsController
  ]
})
export class ProjectsModule {}
