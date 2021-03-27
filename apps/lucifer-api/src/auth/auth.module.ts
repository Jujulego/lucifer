import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { ProjectsDataModule } from '../projects/projects-data.module';
import { ApiKeyModule } from '../projects/api-keys/api-key.module';

import { AuthController } from './auth.controller';
import { ApiKeyStrategy } from './api-key.strategy';
import { JwtStrategy } from './jwt.strategy';

// Module
@Module({
  imports: [
    PassportModule,
    ApiKeyModule,
    ProjectsDataModule
  ],
  providers: [
    ApiKeyStrategy,
    JwtStrategy
  ],
  controllers: [
    AuthController
  ]
})
export class AuthModule {}
