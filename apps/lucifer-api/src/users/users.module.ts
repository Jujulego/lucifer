import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Auth0Module } from '../auth0.module';

import { LocalUser } from './local-user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

// Module
@Module({
  imports: [
    Auth0Module,
    TypeOrmModule.forFeature([LocalUser])
  ],
  providers: [
    UsersService
  ],
  controllers: [
    UsersController
  ],
  exports: [
    UsersService
  ]
})
export class UsersModule {}
