import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

// Module
@Module({
  imports: [
    AuthModule,
    UsersModule
  ],
})
export class AppModule {}
