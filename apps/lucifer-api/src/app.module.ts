import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';

// Module
@Module({
  imports: [
    AuthModule
  ],
})
export class AppModule {}
