import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ManagementClient } from 'auth0';
import * as jwt from 'jsonwebtoken';

import { Permission } from '@lucifer/types';
import { Context } from '../src/context';
import { env } from '../src/env';
import { JWT_KEY } from '../src/auth/jwt.strategy';
import { AuthUser } from '../src/auth/user.model';
import { AppModule } from '../src/app.module';

import { ManagementClientMock } from '../mocks/management-client.mock';

// Utils
export async function initTestingApp(): Promise<INestApplication> {
  const module = await Test.createTestingModule({
    imports: [AppModule]
  })
    .overrideProvider(ManagementClient).useClass(ManagementClientMock)
    .compile();

  const app = module.createNestApplication();
  await app.init();

  return app;
}

export const generateTestUser = (user: string, permissions: Permission[] = []): AuthUser => ({
  sub: user,
  permissions,
})

export async function generateTestToken(user: string, permissions?: Permission[]): Promise<string> {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 5 * 60;

  return jwt.sign({
    ...generateTestUser(user, permissions),
    iss: `https://${env.AUTH0_DOMAIN}/`,
    aud: env.AUTH0_AUDIENCE,
    iat, exp
  }, JWT_KEY);
}

export function generateTestContext(user: string, permissions?: Permission[], token = 'token'): Context {
  return new Context(token, generateTestUser(user, permissions));
}
