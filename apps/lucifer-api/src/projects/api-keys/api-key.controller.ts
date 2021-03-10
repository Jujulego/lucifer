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
import { ScopeGuard, Scopes } from '../../auth/scope.guard';
import { YupPipe } from '../../utils/yup.pipe';

import { ApiKeyService } from './api-key.service';
import { ApiKey } from './api-key.entity';

// Controller
@Controller('/projects/:projectId/api-keys')
@UseGuards(AuthGuard('jwt'), ScopeGuard)
//@AllowIf((req, token) => [token.sub, 'me'].includes(req.params.userId))
export class ApiKeyController {
  // Constructor
  constructor(
    private readonly apiKeys: ApiKeyService
  ) {}

  // Endpoints
  @Post('/')
  @Scopes('create:api-keys')
  async create(
    @Param('projectId') projectId: string,
    @Body(new YupPipe(createApiKeySchema)) data: ICreateApiKey
  ): Promise<IApiKeyWithKey> {
    return await this.apiKeys.create(projectId, data);
  }

  @Get('/')
  @Scopes('read:api-keys')
  async list(
    @Param('projectId') projectId: string
  ): Promise<ApiKey[]> {
    return await this.apiKeys.list(projectId);
  }

  @Get('/:id')
  @Scopes('read:api-keys')
  async get(
    @Param('projectId') projectId: string,
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: string,
  ): Promise<ApiKey> {
    return await this.apiKeys.get(projectId, id);
  }

  @Put('/:id')
  @Scopes('update:api-keys')
  async update(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body(new YupPipe(updateApiKeySchema)) update: IUpdateApiKey
  ): Promise<ApiKey> {
    return await this.apiKeys.update(projectId, id, update);
  }

  @Delete('/:id')
  @Scopes('delete:api-keys')
  async delete(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ): Promise<number | null> {
    return await this.apiKeys.delete(projectId, [id]);
  }

  @Delete('/')
  @Scopes('delete:api-keys')
  async bulkDelete(
    @Param('projectId') projectId: string,
    @Query('ids', ParseArrayPipe) ids: string[],
  ): Promise<number | null> {
    return await this.apiKeys.delete(projectId, ids);
  }
}
