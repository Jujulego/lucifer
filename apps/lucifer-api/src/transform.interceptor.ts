import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { classToPlain } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Context } from './context';

// Interceptor
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T> {
  // Methods
  intercept(exc: ExecutionContext, next: CallHandler<T>): Observable<unknown> {
     const ctx = Context.fromExecutionContext(exc);

    return next.handle()
      .pipe(
        map(data => classToPlain(data, { groups: ctx.user?.permissions }))
      );
  }
}
