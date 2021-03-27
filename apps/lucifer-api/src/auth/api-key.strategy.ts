import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy } from 'passport-http';

import { ApiKeyService } from '../projects/api-keys/api-key.service';

import { AuthInfo } from './auth-info.model';

// Strategy
@Injectable()
export class ApiKeyStrategy extends PassportStrategy(BasicStrategy, 'api-key') {
  // Constructor
  constructor(
    private readonly apiKeys: ApiKeyService
  ) { super(); }

  // Methods
  // noinspection JSUnusedGlobalSymbols
  async validate(id: string, key: string): Promise<AuthInfo> {
    const apk = await this.apiKeys.check(id, key);

    return {
      kind: 'api-key',
      apiKey: apk,
      permissions: []
    };
  }
}
