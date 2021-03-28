import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import * as uuid from 'uuid';

import { IApiKeyWithKey } from '@lucifer/types';

import { ApiKey } from '../src/projects/api-keys/api-key.entity';
import { ApiKeyService } from '../src/projects/api-keys/api-key.service';

// Class
@Injectable()
export class ApiKeyServiceMock extends ApiKeyService {
  // Attributes
  private _apiKeys = new Map<string,IApiKeyWithKey>();

  // Methods
  mockApiKey(label: string, projectId: string): IApiKeyWithKey {
    const apk = {
      projectId, label,
      id: uuid.v4(),
      key: crypto.randomBytes(10).toString('base64')
    };

    this._apiKeys.set(apk.id, apk);

    return apk;
  }

  mockReset() {
    this._apiKeys.clear();
  }

  async check(id: string, key: string): Promise<ApiKey> {
    const apk = this._apiKeys.get(id);

    if (!apk) {
      return await super.check(id, key);
    }

    if (key !== apk.key) {
      throw new UnauthorizedException();
    }

    return apk as ApiKey;
  }
}
