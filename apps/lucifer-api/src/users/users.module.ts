import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Auth0Module } from '../auth0.module';

import { LocalUser } from './local-user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RolesService } from './roles.service';

// Module
@Module({
  imports: [
    Auth0Module,
    TypeOrmModule.forFeature([LocalUser])
  ],
  providers: [
    RolesService,
    UsersService
  ],
  controllers: [
    UsersController
  ],
  exports: [
    RolesService,
    UsersService
  ]
})
export class UsersModule {}
