import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseArrayPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { createApiKeySchema, IApiKeyWithKey, ICreateApiKey, IUpdateApiKey, updateApiKeySchema } from '@lucifer/types';
import { AllowIf, ScopeGuard, Scopes } from '../auth/scope.guard';
import { YupPipe } from '../utils/yup.pipe';

import { ApiKeyService } from './api-key.service';
import { UserId } from './user-id.param';
import { ApiKey } from './api-key.entity';

// Controller
@Controller('/:userId/api-keys')
@UseGuards(AuthGuard('jwt'), ScopeGuard)
@AllowIf((req, token) => [token.sub, 'me'].includes(req.params.userId))
export class ApiKeyController {
  // Constructor
  constructor(
    private readonly apiKeys: ApiKeyService
  ) {}

  // Endpoints
  @Post('/')
  @Scopes('create:api-keys')
  async create(
    @UserId('userId') userId: string,
    @Body(new YupPipe(createApiKeySchema)) data: ICreateApiKey
  ): Promise<IApiKeyWithKey> {
    return await this.apiKeys.create(userId, data);
  }

  @Get('/')
  @Scopes('read:api-keys')
  async list(@UserId('userId') userId: string): Promise<ApiKey[]> {
    return await this.apiKeys.list(userId);
  }

  @Get('/:id')
  @Scopes('read:api-keys')
  async get(
    @UserId('userId') userId: string,
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: string,
  ): Promise<ApiKey> {
    return await this.apiKeys.get(userId, id);
  }

  @Put('/:id')
  @Scopes('update:api-keys')
  async update(
    @UserId('userId') userId: string,
    @Param('id') id: string,
    @Body(new YupPipe(updateApiKeySchema)) update: IUpdateApiKey
  ): Promise<ApiKey> {
    return await this.apiKeys.update(userId, id, update);
  }

  @Delete('/:id')
  @Scopes('delete:api-keys')
  async delete(
    @UserId('userId') userId: string,
    @Param('id') id: string,
  ): Promise<number | null> {
    return await this.apiKeys.delete(userId, [id]);
  }

  @Delete('/')
  @Scopes('delete:api-keys')
  async bulkDelete(
    @UserId('userId') userId: string,
    @Query('ids', ParseArrayPipe) ids: string[],
  ): Promise<number | null> {
    return await this.apiKeys.delete(userId, ids);
  }
}
