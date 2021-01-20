import { INestApplication } from '@nestjs/common';
import { ManagementClient } from 'auth0';
import supertest from 'supertest';

import { generateTestToken, initTestingApp } from '../utils';
import { ManagementClientMock } from '../../mocks/management-client.mock';
import { IUpdateUser } from '@lucifer/types';

// Server setup
let app: INestApplication;
let mgmtClient: ManagementClientMock;
let request: ReturnType<typeof supertest>;

beforeAll(async () => {
  app = await initTestingApp();
  mgmtClient = app.get(ManagementClient);

  // Start server
  request = supertest(app.getHttpServer());
});

afterAll(async () => {
  await app?.close();
});

// Setup data
let adminToken: string;
let basicToken: string;

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

  // Mocks
  mgmtClient.mockSetUsers([admin, basic]);
});

// Tests
describe('GET /users', () => {
  it('should return all users', async () => {
    const rep = await request.get('/users')
      .set('Authorization', `Bearer ${adminToken}`)
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

  it('should return 403 (missing permissions)', async () => {
    await request.get('/users')
      .set('Authorization', `Bearer ${basicToken}`)
      .expect(403);
  });
});

describe('GET /users/:id', () => {
  it('should return user', async () => {
    const rep = await request.get(`/users/${basic.user_id}`)
      .set('Authorization', `Bearer ${adminToken}`)
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
      .set('Authorization', `Bearer ${adminToken}`)
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
      .set('Authorization', `Bearer ${basicToken}`)
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

  it('should return 403 (missing permissions)', async () => {
    await request.get(`/users/${admin.user_id}`)
      .set('Authorization', `Bearer ${basicToken}`)
      .expect(403);
  });

  it('should return 404 (unknown user)', async () => {
    await request.get(`/users/toto`)
      .set('Authorization', `Bearer ${basicToken}`)
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
      .set('Authorization', `Bearer ${adminToken}`)
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
      .set('Authorization', `Bearer ${basicToken}`)
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
      .set('Authorization', `Bearer ${basicToken}`)
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
      .set('Authorization', `Bearer ${adminToken}`)
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
      message: ['email must be an email'],
      statusCode: 400
    });
  });

  it('should return 400 (invalid role)', async () => {
    const rep = await request.put(`/users/${admin.user_id}`)
      .set('Authorization', `Bearer ${adminToken}`)
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
      message: ['each value in roles must be one of the following values: admin, reader'],
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

  it('should return 403 (missing permissions)', async () => {
    await request.put(`/users/${admin.user_id}`)
      .set('Authorization', `Bearer ${basicToken}`)
      .expect(403);

    // Check calls
    expect(mgmtClient.updateUser).not.toBeCalled();
    expect(mgmtClient.assignRolestoUser).not.toBeCalled();
    expect(mgmtClient.removeRolesFromUser).not.toBeCalled();
  });

  it('should return 403 (missing roles permissions)', async () => {
    await request.put(`/users/${basic.user_id}`)
      .set('Authorization', `Bearer ${basicToken}`)
      .send({ ...update, roles: ['reader'] })
      .expect(403);

    // Check calls
    expect(mgmtClient.updateUser).not.toBeCalled();
    expect(mgmtClient.assignRolestoUser).not.toBeCalled();
    expect(mgmtClient.removeRolesFromUser).not.toBeCalled();
  });

  it('should return 404 (unknown user)', async () => {
    await request.put(`/users/toto`)
      .set('Authorization', `Bearer ${basicToken}`)
      .expect(403);

    // Check calls
    expect(mgmtClient.updateUser).not.toBeCalled();
    expect(mgmtClient.assignRolestoUser).not.toBeCalled();
    expect(mgmtClient.removeRolesFromUser).not.toBeCalled();
  });
});
