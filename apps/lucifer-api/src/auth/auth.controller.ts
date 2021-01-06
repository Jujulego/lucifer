import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ConnectedUser } from './user.model';
import type { User } from './user.model';

// Controller
@Controller('/auth')
@UseGuards(AuthGuard('jwt'))
export class AuthController {
  // Routes
  @Get('/permissions')
  getPermissions(@ConnectedUser() user: User): string[] {
    return user.permissions;
  }
}
