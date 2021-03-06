import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy } from 'passport-http';

import { ApiKeyService } from '../users/api-key.service';

import { AuthUser } from './user.model';

// Strategy
@Injectable()
export class ApiKeyStrategy extends PassportStrategy(BasicStrategy, 'api-key') {
  // Constructor
  constructor(
    private readonly apiKeys: ApiKeyService
  ) { super(); }

  // Methods
  // noinspection JSUnusedGlobalSymbols
  async validate(id: string, key: string): Promise<AuthUser> {
    const apk = await this.apiKeys.check(id, key);

    return {
      sub: apk.userId,
      permissions: []
    };
  }
}
