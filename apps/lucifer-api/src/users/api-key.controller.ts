import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { createApiKeySchema, IApiKeyWithKey, ICreateApiKey } from '@lucifer/types';
import { AllowIf, ScopeGuard, Scopes } from '../auth/scope.guard';
import { YupPipe } from '../utils/yup.pipe';

import { ApiKeyService } from './api-key.service';
import { UserId } from './user-id.param';

// Controller
@Controller('/:userId/api-keys')
@UseGuards(AuthGuard('jwt'), ScopeGuard)
export class ApiKeyController {
  // Constructor
  constructor(
    private readonly apiKeys: ApiKeyService
  ) {}

  // Endpoints
  @Post('/')
  @Scopes('create:api-keys')
  @AllowIf((req, token) => [token.sub, 'me'].includes(req.params.userId))
  async create(
    @UserId('userId') userId: string,
    @Body(new YupPipe(createApiKeySchema)) data: ICreateApiKey
  ): Promise<IApiKeyWithKey> {
    return await this.apiKeys.create(userId, data);
  }
}
