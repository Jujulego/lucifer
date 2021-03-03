import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Auth0Module } from '../auth0.module';

import { ApiKey } from './api-key.entity';
import { LocalUser } from './local-user.entity';
import { ApiKeyService } from './api-key.service';
import { RolesService } from './roles.service';
import { UsersService } from './users.service';
import { ApiKeyController } from './api-key.controller';
import { UsersController } from './users.controller';

// Module
@Module({
  imports: [
    Auth0Module,
    TypeOrmModule.forFeature([ApiKey, LocalUser])
  ],
  providers: [
    ApiKeyService,
    RolesService,
    UsersService
  ],
  controllers: [
    ApiKeyController,
    UsersController
  ],
  exports: [
    RolesService,
    UsersService
  ]
})
export class UsersModule {}
