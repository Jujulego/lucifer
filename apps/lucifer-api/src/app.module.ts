import { DynamicModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './db/database.module';
import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/users.module';

import { AppController } from './app.controller';
import { TransformInterceptor } from './transform.interceptor';

// Module
@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    ProjectsModule,
    UsersModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor }
  ],
  controllers: [
    AppController
  ]
})
export class AppModule {
  // Statics
  static async dynamic(): Promise<DynamicModule> {
    const module: DynamicModule = {
      module: AppModule,
    };

    // Load and add coverage controller
    if (global.__coverage__) {
      const { CoverageController } = await import('./coverage.controller');
      module.controllers = [CoverageController];
    }

    return module;
  }
}
