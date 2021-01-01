import { CanActivate, CustomDecorator, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { User } from './user.model';

// Types
export type AllowIfCallback = (req: Request, user: User) => boolean;

// Symbols
const METADATA_KEYS = {
  scopes: Symbol('scope:scopes'),
  allow:  Symbol('scope:allow'),
}

// Decorators
export function Scopes(...scopes: string[]): CustomDecorator<symbol> {
  return SetMetadata(METADATA_KEYS.scopes, scopes);
}

export function AllowIf(cb: AllowIfCallback): CustomDecorator<symbol> {
  return SetMetadata(METADATA_KEYS.allow, cb);
}

// Guard
@Injectable()
export class ScopeGuard implements CanActivate {
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
    const scopes = this.getMetadata<string[]>(ctx, METADATA_KEYS.scopes);
    const allow = this.getMetadata<AllowIfCallback>(ctx, METADATA_KEYS.allow);

    if (!scopes || scopes.length === 0) return true;

    // Get token
    const request = ctx.switchToHttp().getRequest() as Request;
    const token = request.user as User;
    if (!token || !token.permissions) return false;

    // Match
    if (allow && allow(request, token)) return true;
    return scopes.every(scope => token.permissions.includes(scope));
  }
}
