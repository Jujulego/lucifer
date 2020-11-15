import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

// Error filter
@Catch()
export class Auth0ErrorFilter extends BaseExceptionFilter {
  // Methods
  catch(exc: any, host: ArgumentsHost): void {
    if (exc.statusCode && exc.message) {
      exc = new HttpException(HttpException.createBody(exc.message), exc.statusCode);
    }

    return super.catch(exc, host);
  }
}
