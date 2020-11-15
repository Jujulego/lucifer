import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

// Module
@Module({
  imports: [
    PassportModule
  ],
  providers: [
    JwtStrategy
  ],
  controllers: [
    AuthController
  ]
})
export class AuthModule {}
