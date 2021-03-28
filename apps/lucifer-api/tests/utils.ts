import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ManagementClient } from 'auth0';
import * as jwt from 'jsonwebtoken';

import { Permission } from '@lucifer/types';

import { AppModule } from '../src/app.module';
import { Context } from '../src/context';
import { env } from '../src/env';
import { JWT_KEY } from '../src/auth/jwt.strategy';
import { AuthUser } from '../src/auth/auth-info.model';
import { ApiKeyService } from '../src/projects/api-keys/api-key.service';

import { ApiKeyServiceMock } from '../mocks/api-key-service.mock';
import { ManagementClientMock } from '../mocks/management-client.mock';

// Utils
export async function initTestingApp(): Promise<INestApplication> {
  const module = await Test.createTestingModule({
    imports: [AppModule]
  })
    .overrideProvider(ManagementClient).useClass(ManagementClientMock)
    .overrideProvider(ApiKeyService).useClass(ApiKeyServiceMock)
    .compile();

  const app = module.createNestApplication();
  await app.init();

  return app;
}

export const generateTestUser = (user: string, permissions: Permission[] = []): AuthUser => ({
  kind: 'user',
  userId: user,
  permissions,
});

export async function generateTestToken(user: string, permissions?: Permission[]): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 5 * 60;

  const usr = generateTestUser(user, permissions);

  return jwt.sign({
    sub: usr.userId,
    permissions: usr.permissions,
    iss: `https://${env.AUTH0_DOMAIN}/`,
    aud: env.AUTH0_AUDIENCE,
    iat, exp
  }, JWT_KEY);
}

export function generateTestContext(user: string, permissions?: Permission[], token = 'token'): Context {
  return new Context(token, generateTestUser(user, permissions));
}
