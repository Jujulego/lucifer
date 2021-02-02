import { Body, Controller, Get, Put, UseFilters, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { IUpdateUser, updateUserSchema, User } from '@lucifer/types';
import { AllowIf, ScopeGuard, Scopes } from '../auth/scope.guard';
import { Context, Ctx } from '../context';
import { YupPipe } from '../utils/yup.pipe';

import { Auth0ErrorFilter } from './auth0-error.filter';
import { UsersService } from './users.service';
import { UserId } from './user-id.param';

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
  @AllowIf((req, token) => [token.sub, 'me'].includes(req.params.id))
  async get(@UserId('id') id: string): Promise<User> {
    return await this.users.get(id);
  }

  @Put('/:id')
  @Scopes('update:users')
  @AllowIf((req, token) => [token.sub, 'me'].includes(req.params.id))
  async update(
    @Ctx() ctx: Context,
    @UserId('id') id: string,
    @Body(new YupPipe(updateUserSchema)) update: IUpdateUser
  ): Promise<User> {
    return await this.users.update(ctx, id, update);
  }
}
