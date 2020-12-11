import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database.module';
import { UsersModule } from './users/users.module';
import { TransformInterceptor } from './transform.interceptor';

// Module
@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    UsersModule
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor }
  ]
})
export class AppModule {}
