import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './db/database.module';
import { MachinesModule } from './machines/machines.module';
import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/users.module';

import { TransformInterceptor } from './transform.interceptor';

// Module
@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    MachinesModule,
    ProjectsModule,
    UsersModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor }
  ]
})
export class AppModule {}
