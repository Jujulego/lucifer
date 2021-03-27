import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import { Context } from '../context';

// Function
export function parseUsersId(ctx: Context, id: string, parseMe = true) {
  return (ctx.info.kind === 'user' && id === 'me' && parseMe) ? ctx.info.userId : id
}

// Type
export type UserIdOptions = string | {
  /**
   * Parameter's key
   */
  key: string;

  /**
   * Allow special value 'me', witch will be replaced by connected user's id
   * @default true
   */
  parseMe?: boolean;
};

// Decorator
/**
 * Retrieves an id from url parameters
 */
export const UserId: (key: UserIdOptions) => ParameterDecorator = createParamDecorator<UserIdOptions, ExecutionContext, string>((opts, exc) => {
  const ctx = Context.fromExecutionContext(exc);
  const req = exc.switchToHttp().getRequest<Request>();

  // Parse options
  if (typeof opts === 'string') {
    opts = { key: opts };
  }

  const { key, parseMe = true } = opts;

  // Parse parameter
  const id = req.params[key];
  return parseUsersId(ctx, id, parseMe);
});
