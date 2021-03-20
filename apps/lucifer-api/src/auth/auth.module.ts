import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { ProjectsDataModule } from '../projects/projects-data.module';

import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

// Module
@Module({
  imports: [
    PassportModule,
    ProjectsDataModule
  ],
  providers: [
    JwtStrategy
  ],
  controllers: [
    AuthController
  ]
})
export class AuthModule {}
