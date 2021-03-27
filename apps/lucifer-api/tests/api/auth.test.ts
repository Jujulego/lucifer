import { INestApplication } from '@nestjs/common';
import { Connection } from 'typeorm';
import bcrypt from 'bcrypt';
import supertest from 'supertest';

import { generateTestToken, initTestingApp } from '../utils';
import { Project } from '../../src/projects/project.entity';
import { ApiKey } from '../../src/projects/api-keys/api-key.entity';

// Server setup
let app: INestApplication;
let request: ReturnType<typeof supertest>;
let database: Connection;

beforeAll(async () => {
  app = await initTestingApp();

  database = app.get(Connection);

  // Start server
  request = supertest(app.getHttpServer());
});

afterAll(async () => {
  await app?.close();
});

// Generate token & api key
let token: string;
let project: Project;
let apiKey: ApiKey;

beforeEach(async () => {
  // Get token
  token = await generateTestToken('test@test.com', ['read:users']);

  // Data
  await database.transaction(async (manager) => {
    const repoPrj = manager.getRepository(Project);
    const repoApk = manager.getRepository(ApiKey);

    project = await repoPrj.save(
      repoPrj.create({ id: 'test-api-auth-1', name: 'Test #1' })
    );

    apiKey = await repoApk.save(
      repoApk.create({ projectId: project.id, label: 'test-01', key: await bcrypt.hash('test-01', 1) })
    );
  });
});

afterEach(async () => {
  const repoPrj = database.getRepository(Project);
  const repoApk = database.getRepository(ApiKey);

  await repoApk.delete(apiKey.id);
  await repoPrj.delete(project.id);
});

// Tests
describe('JWT authentication', () => {
  it('should return 200', async () => {
    await request.get('/auth/permissions')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .expect('Content-Type', /json/);
  });

  it('should return 401', async () => {
    await request.get('/auth/permissions')
      .expect(401)
      .expect('Content-Type', /json/);
  });
});

describe('API Key authentication', () => {
  it('should return 200', async () => {
    await request.get('/auth/permissions')
      .auth(apiKey.id, 'test-01')
      .expect(200)
      .expect('Content-Type', /json/);
  });

  it('should return 401 (invalid id)', async () => {
    await request.get('/auth/permissions')
      .auth('not-an-api-key-id', 'test-01')
      .expect(401)
      .expect('Content-Type', /json/);
  });


  it('should return 401 (wrong id)', async () => {
    await request.get('/auth/permissions')
      .auth('00000000-0000-0000-0000-000000000000', 'test-01')
      .expect(401)
      .expect('Content-Type', /json/);
  });

  it('should return 401 (wrong secret)', async () => {
    await request.get('/auth/permissions')
      .auth(apiKey.id, 'wrong secret')
      .expect(401)
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
