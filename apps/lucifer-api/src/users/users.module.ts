import { Module } from '@nestjs/common';

import { Auth0Module } from 'src/auth0.module';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';

// Module
@Module({
  imports: [
    Auth0Module
  ],
  providers: [
    UsersService
  ],
  controllers: [
    UsersController
  ]
})
export class UsersModule {}
