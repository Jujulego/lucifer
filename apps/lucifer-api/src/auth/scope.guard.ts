import { CanActivate, CustomDecorator, ExecutionContext, Injectable, Logger, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import type { Permission } from '@lucifer/types';
import type { AuthUser } from './user.model';

// Types
export type AllowIfCallback = (req: Request, user: AuthUser) => boolean;

// Symbols
const METADATA_KEYS = {
  scopes: Symbol('scope:scopes'),
  allow:  Symbol('scope:allow'),
}

// Decorators
export function Scopes(...scopes: Permission[]): CustomDecorator<symbol> {
  return SetMetadata(METADATA_KEYS.scopes, scopes);
}

export function AllowIf(cb: AllowIfCallback): CustomDecorator<symbol> {
  return SetMetadata(METADATA_KEYS.allow, cb);
}

// Guard
@Injectable()
export class ScopeGuard implements CanActivate {
  // Attributes
  private readonly _logger = new Logger(ScopeGuard.name);

  // Constructor
  constructor(
    private reflector: Reflector
  ) {}

  // Methods
  private getMetadata<T>(ctx: ExecutionContext, key: symbol): T {
    // On handler
    const metadata = this.reflector.get<T>(key, ctx.getHandler());
    if (metadata !== undefined) return metadata;

    // On controller
    return this.reflector.get<T>(key, ctx.getClass());
  }

  canActivate(ctx: ExecutionContext): boolean {
    // Get metadata
    const scopes = this.getMetadata<Permission[]>(ctx, METADATA_KEYS.scopes);
    const allow = this.getMetadata<AllowIfCallback>(ctx, METADATA_KEYS.allow);

    if (!scopes || scopes.length === 0) return true;

    // Get token
    const request = ctx.switchToHttp().getRequest() as Request;
    const user = request.user as AuthUser;

    if (!user || !user.permissions) {
      this._logger.debug('Access refused: not a user');
      return false;
    }

    // Match
    if (allow && allow(request, user)) return true;
    const allowed = scopes.every(scope => user.permissions.includes(scope));

    if (!allowed) {
      this._logger.debug(`Access refused: ${user.sub} miss ${scopes} scopes`);
    }

    return allowed;
  }
}
