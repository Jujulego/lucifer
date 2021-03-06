import { INestApplication } from '@nestjs/common';
import { ManagementClient } from 'auth0';
import { Connection, In } from 'typeorm';
import supertest from 'supertest';

import { IApiKey, ICreateApiKey, IUpdateApiKey } from '@lucifer/types';
import { should } from '@lucifer/utils';
import { LocalUser } from '../../src/users/local-user.entity';
import { ApiKey } from '../../src/users/api-key.entity';
import { ApiKeyService } from '../../src/users/api-key.service';

import { generateTestToken, initTestingApp } from '../utils';
import { ManagementClientMock } from '../../mocks/management-client.mock';

// Server setup
let app: INestApplication;
let mgmtClient: ManagementClientMock;
let database: Connection;
let service: ApiKeyService;
let request: ReturnType<typeof supertest>;

beforeAll(async () => {
  app = await initTestingApp();
  mgmtClient = app.get(ManagementClient);

  // Start server
  request = supertest(app.getHttpServer());
  database = app.get(Connection);
  service = app.get(ApiKeyService);
});

afterAll(async () => {
  await app?.close();
});

// Setup data
let adminToken: string;
let basicToken: string;
let lcu: LocalUser;
let apiKeys: ApiKey[];

const admin = {
  user_id: 'tests|api-api-keys-admin',
  email:   'admin@test.com',
  name:    'Admin'
};

const basic = {
  user_id: 'tests|api-api-keys-basic',
  email:   'basic@test.com',
  name:    'Basic'
};

beforeEach(async () => {
  jest.resetAllMocks();
  jest.restoreAllMocks();

  // Get tokens
  adminToken = await generateTestToken(admin.user_id, ['create:api-keys', 'read:api-keys', 'update:api-keys', 'delete:api-keys']);
  basicToken = await generateTestToken(basic.user_id, []);

  // Mocks
  mgmtClient.mockSetUsers([admin, basic]);

  // Data
  await database.transaction(async (manager) => {
    const repoLcu = manager.getRepository(LocalUser);
    const repoApk = manager.getRepository(ApiKey);

    lcu = await repoLcu.save(
      repoLcu.create({ id: admin.user_id })
    );

    apiKeys = await repoApk.save([
      repoApk.create({ userId: lcu.id, label: 'Test 1', key: 'super-key-1' }),
      repoApk.create({ userId: lcu.id, label: 'Test 2', key: 'super-key-2' }),
    ]);
  });
});

afterEach(async () => {
  const repoLcu = database.getRepository(LocalUser);
  const repoApk = database.getRepository(ApiKey);

  await repoApk.delete({ userId: lcu.id, id: In(apiKeys.map(apk => apk.id)) });
  await repoLcu.delete(lcu.id);
});

// Test suites
describe('POST /:userId/api-keys', () => {
  const data: ICreateApiKey = {
    label: 'Test API Key'
  };

  let apk: IApiKey | null;

  beforeEach(() => {
    apk = null;
  });

  afterEach(async () => {
    if (!apk) return;

    const repoApk = database.getRepository(ApiKey);
    await repoApk.delete({ id: apk.id });
  });

  // Tests
  it('should return created api key', async () => {
    const rep = await request.post(`/${admin.user_id}/api-keys`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(data)
      .expect(201)
      .expect('Content-Type', /json/);

    apk = rep.body;
    expect(rep.body).toEqual({
      id:     expect.any(String),
      userId: admin.user_id,
      label:  data.label,
      key:    expect.any(String)
    });
  });

  it('should return created api key (me special id)', async () => {
    const rep = await request.post('/me/api-keys')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(data)
      .expect(201)
      .expect('Content-Type', /json/);

    apk = rep.body;
    expect(rep.body).toEqual({
      id:     expect.any(String),
      userId: admin.user_id,
      label:  data.label,
      key:    expect.any(String)
    });
  });

  it('should return 400 (too long label)', async () => {
    const rep = await request.post(`/${admin.user_id}/api-keys`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        label: 'this-is-a-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-too-long-label'
      })
      .expect(400)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual(should.be.badRequest(
      { path: 'label', type: 'max', errors: [expect.any(String)] },
    ));
  });

  it('should return 401 (not authenticated)', async () => {
    await request.post(`/${admin.user_id}/api-keys`)
      .expect(401);
  });

  it('should return 403 (missing permissions)', async () => {
    await request.post(`/${admin.user_id}/api-keys`)
      .set('Authorization', `Bearer ${basicToken}`)
      .expect(403);
  });

  it('should return 404 (unknown user)', async () => {
    await request.post('/not-a-user-id/api-keys')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(data)
      .expect(404);
  });
});

describe('GET /:userId/api-keys', () => {
  it('should return all user\'s api keys', async () => {
    const rep = await request.get(`/${admin.user_id}/api-keys`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual(expect.arrayContaining(
      apiKeys.map(apk => expect.objectContaining({
        id: apk.id
      })
    )));
  });

  it('should return all user\'s api-keys (me special id)', async () => {
    const rep = await request.get('/me/api-keys')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual(expect.arrayContaining(
      apiKeys.map(apk => expect.objectContaining({
        id: apk.id
      }))
    ));
  });

  it('should return 401 (not authenticated)', async () => {
    await request.get(`/${admin.user_id}/api-keys`)
      .expect(401);
  });

  it('should return 403 (missing permissions)', async () => {
    await request.get(`/${admin.user_id}/api-keys`)
      .set('Authorization', `Bearer ${basicToken}`)
      .expect(403);
  });
});

describe('GET /:userId/api-keys/:id', () => {
  it('should return a project', async () => {
    const apk = apiKeys[0];

    const rep = await request.get(`/${apk.userId}/api-keys/${apk.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual({
      id:     apk.id,
      userId: apk.userId,
      label:  apk.label,
    });
  });

  it('should return a project (me special id)', async () => {
    const apk = apiKeys[0];

    const rep = await request.get(`/me/api-keys/${apk.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual(expect.objectContaining({
      id: apk.id,
    }));
  });

  it('should return 401 (not authenticated)', async () => {
    const apk = apiKeys[0];

    await request.get(`/${apk.userId}/api-keys/${apk.id}`)
      .expect(401);
  });

  it('should return 403 (missing permissions)', async () => {
    const apk = apiKeys[0];

    await request.get(`/${apk.userId}/api-keys/${apk.id}`)
      .set('Authorization', `Bearer ${basicToken}`)
      .expect(403);
  });

  it('should return 404 (invalid api key)', async () => {
    const apk = apiKeys[0];

    await request.get(`/${apk.userId}/api-keys/not-an-api-key-id`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });

  it('should return 404 (unknown api key)', async () => {
    const apk = apiKeys[0];

    await request.get(`/${apk.userId}/api-keys/12345678-1234-1234-1234-123456789abc`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });

  it('should return 404 (unknown api key for user)', async () => {
    const apk = apiKeys[0];

    await request.get(`/not-a-user-id/api-keys/${apk.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });
});

describe('PUT /:userId/api-keys/:id', () => {
  const data: IUpdateApiKey = {
    label: 'Test API Key'
  };

  beforeEach(() => {
    jest.spyOn(service, 'update');
  });

  // Tests
  it('should update project', async () => {
    const apk = apiKeys[0];

    const rep = await request.put(`/${apk.userId}/api-keys/${apk.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(data)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual({
      id:     apk.id,
      userId: apk.userId,
      label:  data.label
    });
    expect(service.update).toBeCalledWith(apk.userId, apk.id, data);
  });

  it('should update project (me special id)', async () => {
    const apk = apiKeys[0];

    const rep = await request.put(`/me/api-keys/${apk.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(data)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual({
      id:     apk.id,
      userId: apk.userId,
      label:  data.label
    });
    expect(service.update).toBeCalledWith(apk.userId, apk.id, data);
  });

  it('should return 400 (too long label)', async () => {
    const apk = apiKeys[0];

    const rep = await request.put(`/me/api-keys/${apk.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        label: 'This as a very very very very very very very very very very very very very very very very very too long label'
      })
      .expect(400)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual(should.be.badRequest(
      { path: 'label', type: 'max', errors: [expect.any(String)] }
    ));
    expect(service.update).not.toBeCalled();
  });

  it('should return 401 (not authenticated)', async () => {
    const apk = apiKeys[0];

    await request.put(`/${apk.userId}/api-keys/${apk.id}`)
      .expect(401);

    expect(service.update).not.toBeCalled();
  });

  it('should return 403 (missing permissions)', async () => {
    const apk = apiKeys[0];

    await request.put(`/${apk.userId}/api-keys/${apk.id}`)
      .set('Authorization', `Bearer ${basicToken}`)
      .expect(403);

    expect(service.update).not.toBeCalled();
  });

  it('should return 404 (unknown api key)', async () => {
    const apk = apiKeys[0];

    await request.put(`/${apk.userId}/api-keys/12345678-1234-1234-1234-123456789abc`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);

    expect(service.update).toBeCalledWith(apk.userId, '12345678-1234-1234-1234-123456789abc', {});
  });

  it('should return 404 (unknown user)', async () => {
    const apk = apiKeys[0];

    await request.put(`/not-a-user-id/api-keys/${apk.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);

    expect(service.update).toBeCalledWith('not-a-user-id', apk.id, {});
  });
});

describe('DELETE /:userId/api-keys/:id', () => {
  beforeEach(() => {
    jest.spyOn(service, 'delete');
  });

  // Tests
  it('should delete project', async () => {
    const apk = apiKeys[0];

    await request.delete(`/${apk.userId}/api-keys/${apk.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(service.delete)
      .toBeCalledWith(apk.userId, [apk.id]);
  });

  it('should delete project (me special id)', async () => {
    const apk = apiKeys[0];

    await request.delete(`/me/api-keys/${apk.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(service.delete)
      .toBeCalledWith(apk.userId, [apk.id]);
  });

  it('should return 401 (not authenticated)', async () => {
    const apk = apiKeys[0];

    await request.delete(`/${apk.userId}/api-keys/${apk.id}`)
      .expect(401);

    expect(service.delete).not.toBeCalled();
  });

  it('should return 403 (missing permissions)', async () => {
    const apk = apiKeys[0];

    await request.delete(`/${apk.userId}/api-keys/${apk.id}`)
      .set('Authorization', `Bearer ${basicToken}`)
      .expect(403);

    expect(service.delete).not.toBeCalled();
  });
});

describe('DELETE /:userId/api-keys', () => {
  let ids: string[];

  beforeEach(() => {
    jest.spyOn(service, 'delete');
    ids = apiKeys.map(apk => apk.id);
  });

  // Tests
  it('should delete project', async () => {
    await request.delete(`/${admin.user_id}/api-keys`)
      .query({ ids: ids })
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(service.delete)
      .toBeCalledWith(admin.user_id, ids);
  });

  it('should delete project (me special id)', async () => {
    await request.delete('/me/api-keys')
      .query({ ids: ids })
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(service.delete)
      .toBeCalledWith(admin.user_id, ids);
  });

  it('should return 401 (not authenticated)', async () => {
    const apk = apiKeys[0];

    await request.delete(`/${apk.userId}/api-keys`)
      .expect(401);

    expect(service.delete).not.toBeCalled();
  });

  it('should return 403 (missing permissions)', async () => {
    const apk = apiKeys[0];

    await request.delete(`/${apk.userId}/api-keys`)
      .set('Authorization', `Bearer ${basicToken}`)
      .expect(403);

    expect(service.delete).not.toBeCalled();
  });
});
