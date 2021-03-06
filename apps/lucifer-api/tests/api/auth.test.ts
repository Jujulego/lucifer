import { INestApplication } from '@nestjs/common';
import supertest from 'supertest';

import { generateTestToken, initTestingApp } from '../utils';

// Server setup
let app: INestApplication;
let request: ReturnType<typeof supertest>;

beforeAll(async () => {
  app = await initTestingApp();

  // Start server
  request = supertest(app.getHttpServer());
});

afterAll(async () => {
  await app?.close();
});

// Generate token
let token: string;

beforeEach(async () => {
  // Get token
  token = await generateTestToken('test@test.com', ['read:users']);
});

// Tests
describe('JWT authentication', () => {
  it('should return 200', async () => {
    await request.get('/auth/permissions')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/);
  });

  it('should return 401', async () => {
    await request.get('/auth/permissions')
      .expect(401)
      .expect('Content-Type', /json/);
  });
});

it('should return user\'s permissions', async () => {
  const rep = await request.get('/auth/permissions')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', /json/);

  expect(rep.body)
    .toEqual(['read:users']);
});
