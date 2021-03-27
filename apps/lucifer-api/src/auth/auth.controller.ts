import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Context, Ctx } from '../context';

// Controller
@Controller('/auth')
@UseGuards(AuthGuard(['jwt', 'api-key']))
export class AuthController {
  // Routes
  @Get('/permissions')
  getPermissions(@Ctx() ctx: Context): string[] {
    return ctx.info.permissions;
  }
}
