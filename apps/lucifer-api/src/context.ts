import { createParamDecorator, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';

import type { Permission } from '@lucifer/types';
import type { AuthUser } from './auth/user.model';

// Class
export class Context {
  // Constructor
  constructor(
    readonly token: string,
    readonly user: AuthUser
  ) {}

  // Statics
  /**
   * Build Context from current request
   * @param req
   */
  static fromRequest(req: Request): Context {
    return new Context(
      req.headers.authorization?.replace('Bearer ', '') || '',
      req.user as AuthUser
    )
  }

  /**
   * Build Context from current ExecutionContext
   * @param exc
   */
  static fromExecutionContext(exc: ExecutionContext): Context {
    const req = exc.switchToHttp().getRequest<Request>();
    return this.fromRequest(req);
  }

  // Methods
  need(scopes: Permission | Permission[]) {
    if (typeof scopes === 'string') {
      scopes = [scopes];
    }

    // Test if has scopes
    if (scopes.every(scope => !this.user.permissions.includes(scope))) {
      throw new ForbiddenException();
    }
  }
}

// Decorator
/**
 * Allow to retrieve current Context as an endpoint parameter
 */
export const Ctx = createParamDecorator<unknown, ExecutionContext, Context>((data, exc) => {
  return Context.fromExecutionContext(exc);
});
