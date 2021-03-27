import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiKey } from './api-key.entity';
import { ApiKeyService } from './api-key.service';
import { ApiKeyController } from './api-key.controller';
import { ProjectsDataModule } from '../projects-data.module';

// Module
@Module({
  imports: [
    TypeOrmModule.forFeature([ApiKey]),
    ProjectsDataModule
  ],
  providers: [
    ApiKeyService
  ],
  controllers: [
    ApiKeyController
  ],
  exports: [
    ApiKeyService
  ]
})
export class ApiKeyModule {}
