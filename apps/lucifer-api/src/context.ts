import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import type { AuthUser } from './auth/user.model';

// Class
export class Context {
  // Constructor
  constructor(
    readonly token: string,
    readonly user: AuthUser
  ) {}

  // Methods
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
}

// Decorator
/**
 * Allow to retrieve current Context as an endpoint parameter
 */
export const Ctx = createParamDecorator<unknown, ExecutionContext, Context>((data, exc) => {
  return Context.fromExecutionContext(exc);
});
