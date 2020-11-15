import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AllowIf, ScopeGuard, Scopes } from 'src/auth/scope.guard';

import { UpdateUser, User } from './user.model';
import { UsersService } from './users.service';

// Controller
@Controller('/users')
@UseGuards(AuthGuard('jwt'), ScopeGuard)
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
  @AllowIf(({ params }, token) => params.id === token.sub)
  async get(@Param('id') id: string): Promise<User> {
    return await this.users.get(id);
  }

  @Put('/:id')
  @Scopes('read:users')
  @AllowIf((req, token) => req.params.id === token.sub)
  async update(@Param('id') id: string, @Body() update: UpdateUser): Promise<User> {
    return await this.users.update(id, update);
  }
}
