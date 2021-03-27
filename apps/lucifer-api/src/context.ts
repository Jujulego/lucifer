import { createParamDecorator, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';

import type { Permission } from '@lucifer/types';
import type { AuthInfo } from './auth/auth-info.model';

// Class
export class Context {
  // Constructor
  constructor(
    readonly token: string,
    readonly info: AuthInfo
  ) {}

  // Statics
  /**
   * Build Context from current request
   * @param req
   */
  static fromRequest(req: Request): Context {
    return new Context(
      req.headers.authorization?.replace('Bearer ', '') || '',
      req.user as AuthInfo
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
  has(scopes: Permission | Permission[]) {
    if (typeof scopes === 'string') {
      scopes = [scopes];
    }

    // Test if has scopes
    return scopes.some(scope => this.info.permissions.includes(scope));
  }

  need(scopes: Permission | Permission[]) {
    // Assert if has scopes
    if (!this.has(scopes)) {
      throw new ForbiddenException();
    }
  }

  // Property
  get clientLog(): string {
    switch (this.info.kind) {
      case 'user':
        return `user:${this.info.userId}`;

      case 'api-key':
        return `api-key:${this.info.apiKey.id}`;
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
