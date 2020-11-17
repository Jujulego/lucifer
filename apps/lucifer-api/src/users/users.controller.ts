import { Body, Controller, Get, Param, Put, UseFilters, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AllowIf, ScopeGuard, Scopes } from '../auth/scope.guard';

import { User } from '@lucifer/types';
import { UpdateUser } from './user.schema';
import { UsersService } from './users.service';
import { Auth0ErrorFilter } from './auth0-error.filter';

// Controller
@Controller('/users')
@UseGuards(AuthGuard('jwt'), ScopeGuard)
@UseFilters(Auth0ErrorFilter)
export class UsersController {
  // Constructor
  constructor(
    private users: UsersService
  ) {}

  // Endpoints
  @Get('/')
  @Scopes('read:users')
  async list(): Promise<User[]> {
    return await this.users.list();
  }

  @Get('/:id')
  @Scopes('read:users')
  @AllowIf((req, token) => req.params.id === token.sub)
  async get(@Param('id') id: string): Promise<User> {
    return await this.users.get(id);
  }

  @Put('/:id')
  @Scopes('read:users')
  @AllowIf((req, token) => req.params.id === token.sub)
  async update(@Param('id') id: string, @Body(ValidationPipe) update: UpdateUser): Promise<User> {
    return await this.users.update(id, update);
  }
}
