import { INestApplication } from '@nestjs/common';
import { ManagementClient } from 'auth0';
import supertest from 'supertest';

import { IApiKeyWithKey, IUpdateUser } from '@lucifer/types';

import { ApiKeyService } from '../../src/projects/api-keys/api-key.service';

import { generateTestToken, initTestingApp } from '../utils';
import { ManagementClientMock } from '../../mocks/management-client.mock';
import { ApiKeyServiceMock } from '../../mocks/api-key-service.mock';

// Server setup
let app: INestApplication;
let mgmtClient: ManagementClientMock;
let apkMock: ApiKeyServiceMock;
let request: ReturnType<typeof supertest>;

beforeAll(async () => {
  app = await initTestingApp();
  mgmtClient = app.get(ManagementClient);

  // Start server
  request = supertest(app.getHttpServer());
  apkMock = app.get(ApiKeyService);
});

afterAll(async () => {
  await app?.close();
});

// Setup data
let adminToken: string;
let basicToken: string;
let testApk: IApiKeyWithKey;

const admin = {
  user_id: 'tests|api-users-admin',
  email:   'admin@test.com',
  name:    'Admin'
};

const basic = {
  user_id: 'tests|api-users-basic',
  email:   'basic@test.com',
  name:    'Basic'
};

beforeEach(async () => {
  jest.resetAllMocks();
  jest.restoreAllMocks();

  // Get tokens
  adminToken = await generateTestToken(admin.user_id, ['read:users', 'update:users', 'read:roles', 'update:roles']);
  basicToken = await generateTestToken(basic.user_id, []);

  // Get api-key
  apkMock.mockReset();
  testApk = apkMock.mockApiKey('mock-key', 'mock-project');

  // Mocks
  mgmtClient.mockSetUsers([admin, basic]);
});

// Tests
describe('GET /users', () => {
  it('should return all users', async () => {
    const rep = await request.get('/users')
      .auth(adminToken, { type: 'bearer' })
      .expect(200)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual([
      expect.objectContaining({
        id: admin.user_id
      }),
      expect.objectContaining({
        id: basic.user_id
      })
    ]);
  });

  it('should return 401 (not authenticated)', async () => {
    await request.get('/users')
      .expect(401);
  });

  it('should return 401 (not allowed to api keys)', async () => {
    await request.get('/users')
      .auth(testApk.id, testApk.key)
      .expect(401);
  });

  it('should return 403 (missing permissions)', async () => {
    await request.get('/users')
      .auth(basicToken, { type: 'bearer' })
      .expect(403);
  });
});

describe('GET /users/:id', () => {
  it('should return user', async () => {
    const rep = await request.get(`/users/${basic.user_id}`)
      .auth(adminToken, { type: 'bearer' })
      .expect(200)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual({
      id:    basic.user_id,
      email: basic.email,
      name:  basic.name,
      roles: [],
      canUpdate: true
    });
  });

  it('should return user (\'me\' special id)', async () => {
    const rep = await request.get('/users/me')
      .auth(adminToken, { type: 'bearer' })
      .expect(200)
      .expect('Content-Type', /json/);

    expect(rep.body)
      .toEqual({
        id:    admin.user_id,
        email: admin.email,
        name:  admin.name,
        roles: [],
        canUpdate: true
      });
  });

  it('should return user (self access allowed)', async () => {
    const rep = await request.get(`/users/${basic.user_id}`)
      .auth(basicToken, { type: 'bearer' })
      .expect(200)
      .expect('Content-Type', /json/);

    expect(rep.body)
      .toEqual({
        id:    basic.user_id,
        email: basic.email,
        name:  basic.name,
        canUpdate: true
      });
  });

  it('should return 401 (not authenticated)', async () => {
    await request.get(`/users/${admin.user_id}`)
      .expect(401);
  });

  it('should return 401 (not allowed to api keys)', async () => {
    await request.get(`/users/${admin.user_id}`)
      .auth(testApk.id, testApk.key)
      .expect(401);
  });

  it('should return 403 (missing permissions)', async () => {
    await request.get(`/users/${admin.user_id}`)
      .auth(basicToken, { type: 'bearer' })
      .expect(403);
  });

  it('should return 404 (unknown user)', async () => {
    await request.get(`/users/toto`)
      .auth(basicToken, { type: 'bearer' })
      .expect(403);
  });
});

describe('PUT /users/:id', () => {
  let update: IUpdateUser;

  beforeEach(() => {
    jest.spyOn(mgmtClient, 'updateUser');
    jest.spyOn(mgmtClient, 'assignRolestoUser');
    jest.spyOn(mgmtClient, 'removeRolesFromUser');

    update = {
      email: 'cisab@test.com',
      name:  'Cisab'
    };
  });

  // Tests
  it('should update the user', async () => {
    const rep = await request.put(`/users/${basic.user_id}`)
      .auth(adminToken, { type: 'bearer' })
      .send(update)
      .expect(200)
      .expect('Content-Type', /json/);

    // Check calls
    expect(mgmtClient.updateUser).toBeCalledWith({ id: basic.user_id }, update);
    expect(mgmtClient.assignRolestoUser).not.toBeCalled();
    expect(mgmtClient.removeRolesFromUser).not.toBeCalled();

    // Check body
    expect(rep.body).toEqual({
      id:    basic.user_id,
      email: update.email,
      name:  update.name,
      roles: [],
      canUpdate: true
    });
  });

  it('should update the user (\'me\' special id)', async () => {
    const rep = await request.put('/users/me')
      .auth(basicToken, { type: 'bearer' })
      .send(update)
      .expect(200)
      .expect('Content-Type', /json/);

    // Check calls
    expect(mgmtClient.updateUser).toBeCalledWith({ id: basic.user_id }, update);
    expect(mgmtClient.assignRolestoUser).not.toBeCalled();
    expect(mgmtClient.removeRolesFromUser).not.toBeCalled();

    // Check body
    expect(rep.body).toEqual({
      id:    basic.user_id,
      email: update.email,
      name:  update.name,
      canUpdate: true
    });
  });

  it('should update the user (self access allowed)', async () => {
    const rep = await request.put(`/users/${basic.user_id}`)
      .auth(basicToken, { type: 'bearer' })
      .send(update)
      .expect(200)
      .expect('Content-Type', /json/);

    // Check calls
    expect(mgmtClient.updateUser).toBeCalledWith({ id: basic.user_id }, update);
    expect(mgmtClient.assignRolestoUser).not.toBeCalled();
    expect(mgmtClient.removeRolesFromUser).not.toBeCalled();

    // Check body
    expect(rep.body).toEqual({
      id:    basic.user_id,
      email: update.email,
      name:  update.name,
      canUpdate: true
    });
  });

  it('should return 400 (invalid email)', async () => {
    const rep = await request.put(`/users/${admin.user_id}`)
      .auth(adminToken, { type: 'bearer' })
      .send({ email: 'not an email' })
      .expect(400)
      .expect('Content-Type', /json/);

    // Check calls
    expect(mgmtClient.updateUser).not.toBeCalled();
    expect(mgmtClient.assignRolestoUser).not.toBeCalled();
    expect(mgmtClient.removeRolesFromUser).not.toBeCalled();

    // Check body
    expect(rep.body).toEqual({
      error: 'Bad Request',
      message: [{
        path: 'email',
        type: 'email',
        errors: ['email must be a valid email']
      }],
      statusCode: 400
    });
  });

  it('should return 400 (invalid role)', async () => {
    const rep = await request.put(`/users/${admin.user_id}`)
      .auth(adminToken, { type: 'bearer' })
      .send({ roles: ['not an role'] })
      .expect(400)
      .expect('Content-Type', /json/);

    // Check calls
    expect(mgmtClient.updateUser).not.toBeCalled();
    expect(mgmtClient.assignRolestoUser).not.toBeCalled();
    expect(mgmtClient.removeRolesFromUser).not.toBeCalled();

    // Check body
    expect(rep.body).toEqual({
      error: 'Bad Request',
      message: [{
        path: 'roles[0]',
        type: 'oneOf',
        errors: ['roles[0] must be one of the following values: admin, reader'],
      }],
      statusCode: 400
    });
  });

  it('should return 401 (not authenticated)', async () => {
    await request.put(`/users/${admin.user_id}`)
      .expect(401);

    // Check calls
    expect(mgmtClient.updateUser).not.toBeCalled();
    expect(mgmtClient.assignRolestoUser).not.toBeCalled();
    expect(mgmtClient.removeRolesFromUser).not.toBeCalled();
  });

  it('should return 401 (not allowed to api keys)', async () => {
    await request.put(`/users/${admin.user_id}`)
      .auth(testApk.id, testApk.key)
      .expect(401);

    // Check calls
    expect(mgmtClient.updateUser).not.toBeCalled();
    expect(mgmtClient.assignRolestoUser).not.toBeCalled();
    expect(mgmtClient.removeRolesFromUser).not.toBeCalled();
  });

  it('should return 403 (missing permissions)', async () => {
    await request.put(`/users/${admin.user_id}`)
      .auth(basicToken, { type: 'bearer' })
      .expect(403);

    // Check calls
    expect(mgmtClient.updateUser).not.toBeCalled();
    expect(mgmtClient.assignRolestoUser).not.toBeCalled();
    expect(mgmtClient.removeRolesFromUser).not.toBeCalled();
  });

  it('should return 403 (missing roles permissions)', async () => {
    await request.put(`/users/${basic.user_id}`)
      .auth(basicToken, { type: 'bearer' })
      .send({ ...update, roles: ['reader'] })
      .expect(403);

    // Check calls
    expect(mgmtClient.updateUser).not.toBeCalled();
    expect(mgmtClient.assignRolestoUser).not.toBeCalled();
    expect(mgmtClient.removeRolesFromUser).not.toBeCalled();
  });

  it('should return 404 (unknown user)', async () => {
    await request.put(`/users/toto`)
      .auth(basicToken, { type: 'bearer' })
      .expect(403);

    // Check calls
    expect(mgmtClient.updateUser).not.toBeCalled();
    expect(mgmtClient.assignRolestoUser).not.toBeCalled();
    expect(mgmtClient.removeRolesFromUser).not.toBeCalled();
  });
});
