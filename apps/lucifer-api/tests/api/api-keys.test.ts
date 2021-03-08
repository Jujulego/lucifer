import { INestApplication } from '@nestjs/common';
import { ManagementClient } from 'auth0';
import { Connection, In } from 'typeorm';
import supertest from 'supertest';

import { IApiKey, ICreateApiKey, IUpdateApiKey } from '@lucifer/types';
import { should } from '@lucifer/utils';
import { LocalUser } from '../../src/users/local-user.entity';
import { Project } from '../../src/projects/project.entity';
import { ApiKey } from '../../src/projects/api-keys/api-key.entity';
import { ApiKeyService } from '../../src/projects/api-keys/api-key.service';

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
let projects: Project[];
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
    const repoPrj = manager.getRepository(Project);
    const repoApk = manager.getRepository(ApiKey);

    lcu = await repoLcu.save(
      repoLcu.create({ id: admin.user_id })
    );

    projects = await repoPrj.save([
      repoPrj.create({ adminId: lcu.id, id: 'test-1', name: 'Test #1' }),
      repoPrj.create({ adminId: lcu.id, id: 'test-2', name: 'Test #2' }),
    ]);

    apiKeys = await repoApk.save([
      repoApk.create({ adminId: lcu.id, projectId: projects[0].id, label: 'test-01', key: 'test-01' }),
      repoApk.create({ adminId: lcu.id, projectId: projects[0].id, label: 'test-02', key: 'test-02' }),
      repoApk.create({ adminId: lcu.id, projectId: projects[1].id, label: 'test-03', key: 'test-03' }),
    ]);
  });
});

afterEach(async () => {
  const repoLcu = database.getRepository(LocalUser);
  const repoPrj = database.getRepository(Project);
  const repoApk = database.getRepository(ApiKey);

  await repoApk.delete(apiKeys.map(apk => apk.id));
  await repoPrj.delete({ adminId: lcu.id, id: In(projects.map(prj => prj.id)) });
  await repoLcu.delete(lcu.id);
});

// Test suites
describe('POST /:userId/projects/:projectId/api-keys', () => {
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
    const rep = await request.post(`/${admin.user_id}/projects/${projects[1].id}/api-keys`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(data)
      .expect(201)
      .expect('Content-Type', /json/);

    apk = rep.body;
    expect(rep.body).toEqual({
      id:        expect.any(String),
      adminId:   admin.user_id,
      projectId: projects[1].id,
      label:     data.label,
      key:       expect.any(String)
    });
  });

  it('should return created api key (me special id)', async () => {
    const rep = await request.post(`/me/projects/${projects[1].id}/api-keys`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(data)
      .expect(201)
      .expect('Content-Type', /json/);

    apk = rep.body;
    expect(rep.body).toEqual({
      id:        expect.any(String),
      adminId:   admin.user_id,
      projectId: projects[1].id,
      label:     data.label,
      key:       expect.any(String)
    });
  });

  it('should return 400 (too long label)', async () => {
    const rep = await request.post(`/${admin.user_id}/projects/${projects[1].id}/api-keys`)
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
    await request.post(`/${admin.user_id}/projects/${projects[1].id}/api-keys`)
      .expect(401);
  });

  it('should return 403 (missing permissions)', async () => {
    await request.post(`/${admin.user_id}/projects/${projects[1].id}/api-keys`)
      .set('Authorization', `Bearer ${basicToken}`)
      .expect(403);
  });

  it('should return 404 (unknown user)', async () => {
    await request.post(`/not-a-user-id/projects/${projects[1].id}/api-keys`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(data)
      .expect(404);
  });

  it('should return 404 (unknown project)', async () => {
    await request.post(`/${admin.user_id}/projects/not-a-project-id/api-keys`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(data)
      .expect(404);
  });
});

describe('GET /:userId/projects/:projectId/api-keys', () => {
  it('should return all project\'s api keys', async () => {
    const rep = await request.get(`/${admin.user_id}/projects/${projects[1].id}/api-keys`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual(expect.arrayContaining(
      apiKeys.filter(apk => apk.projectId === projects[1].id)
        .map(apk => expect.objectContaining({
          id: apk.id
        }))
    ));
  });

  it('should return all project\'s api-keys (me special id)', async () => {
    const rep = await request.get(`/me/projects/${projects[1].id}/api-keys`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual(expect.arrayContaining(
      apiKeys.filter(apk => apk.projectId === projects[1].id)
        .map(apk => expect.objectContaining({
          id: apk.id
        }))
    ));
  });

  it('should return 401 (not authenticated)', async () => {
    await request.get(`/${admin.user_id}/projects/${projects[1].id}/api-keys`)
      .expect(401);
  });

  it('should return 403 (missing permissions)', async () => {
    await request.get(`/${admin.user_id}/projects/${projects[1].id}/api-keys`)
      .set('Authorization', `Bearer ${basicToken}`)
      .expect(403);
  });
});

describe('GET /:userId/projects/:projectId/api-keys/:id', () => {
  it('should return an api key', async () => {
    const apk = apiKeys[0];

    const rep = await request.get(`/${apk.adminId}/projects/${apk.projectId}/api-keys/${apk.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual({
      adminId:   apk.adminId,
      projectId: apk.projectId,
      id:        apk.id,
      label:     apk.label,
    });
  });

  it('should return an api key (me special id)', async () => {
    const apk = apiKeys[0];

    const rep = await request.get(`/me/projects/${apk.projectId}/api-keys/${apk.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual(expect.objectContaining({
      id: apk.id,
    }));
  });

  it('should return 401 (not authenticated)', async () => {
    const apk = apiKeys[0];

    await request.get(`/${apk.adminId}/projects/${apk.projectId}/api-keys/${apk.id}`)
      .expect(401);
  });

  it('should return 403 (missing permissions)', async () => {
    const apk = apiKeys[0];

    await request.get(`/${apk.adminId}/projects/${apk.projectId}/api-keys/${apk.id}`)
      .set('Authorization', `Bearer ${basicToken}`)
      .expect(403);
  });

  it('should return 404 (invalid api key)', async () => {
    const apk = apiKeys[0];

    await request.get(`/${apk.adminId}/projects/${apk.projectId}/api-keys/not-an-api-key-id`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });

  it('should return 404 (unknown api key)', async () => {
    const apk = apiKeys[0];

    await request.get(`/${apk.adminId}/projects/${apk.projectId}/api-keys/12345678-1234-1234-1234-123456789abc`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });

  it('should return 404 (unknown api key for user)', async () => {
    const apk = apiKeys[0];

    await request.get(`/not-a-user-id/projects/${apk.projectId}/api-keys/${apk.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });

  it('should return 404 (unknown api key for project)', async () => {
    const apk = apiKeys[0];

    await request.get(`/${apk.adminId}/projects/not-a-project-id/api-keys/${apk.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });
});

describe('PUT /:userId/projects/:projectId/api-keys/:id', () => {
  const data: IUpdateApiKey = {
    label: 'Test API Key'
  };

  beforeEach(() => {
    jest.spyOn(service, 'update');
  });

  // Tests
  it('should update api key', async () => {
    const apk = apiKeys[0];

    const rep = await request.put(`/${apk.adminId}/projects/${apk.projectId}/api-keys/${apk.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(data)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual({
      adminId:   apk.adminId,
      projectId: apk.projectId,
      id:        apk.id,
      label:     data.label,
    });
    expect(service.update).toBeCalledWith(apk.adminId, apk.projectId, apk.id, data);
  });

  it('should update project (me special id)', async () => {
    const apk = apiKeys[0];

    const rep = await request.put(`/me/projects/${apk.projectId}/api-keys/${apk.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(data)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual({
      adminId:   apk.adminId,
      projectId: apk.projectId,
      id:        apk.id,
      label:     data.label,
    });
    expect(service.update).toBeCalledWith(apk.adminId, apk.projectId, apk.id, data);
  });

  it('should return 400 (too long label)', async () => {
    const apk = apiKeys[0];

    const rep = await request.put(`/me/projects/${apk.projectId}/api-keys/${apk.id}`)
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

    await request.put(`/${apk.adminId}/projects/${apk.projectId}/api-keys/${apk.id}`)
      .expect(401);

    expect(service.update).not.toBeCalled();
  });

  it('should return 403 (missing permissions)', async () => {
    const apk = apiKeys[0];

    await request.put(`/${apk.adminId}/projects/${apk.projectId}/api-keys/${apk.id}`)
      .set('Authorization', `Bearer ${basicToken}`)
      .expect(403);

    expect(service.update).not.toBeCalled();
  });

  it('should return 404 (unknown api key)', async () => {
    const apk = apiKeys[0];

    await request.put(`/${apk.adminId}/projects/${apk.projectId}/api-keys/12345678-1234-1234-1234-123456789abc`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);

    expect(service.update).toBeCalledWith(apk.adminId, apk.projectId, '12345678-1234-1234-1234-123456789abc', {});
  });

  it('should return 404 (unknown user)', async () => {
    const apk = apiKeys[0];

    await request.put(`/not-a-user-id/projects/${apk.projectId}/api-keys/${apk.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);

    expect(service.update).toBeCalledWith('not-a-user-id', apk.projectId, apk.id, {});
  });

  it('should return 404 (unknown project)', async () => {
    const apk = apiKeys[0];

    await request.put(`/${apk.adminId}/projects/not-a-project-id/api-keys/${apk.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);

    expect(service.update).toBeCalledWith(apk.adminId, 'not-a-project-id', apk.id, {});
  });
});

describe('DELETE /:userId/projects/:projectId/api-keys/:id', () => {
  beforeEach(() => {
    jest.spyOn(service, 'delete');
  });

  // Tests
  it('should delete project', async () => {
    const apk = apiKeys[0];

    await request.delete(`/${apk.adminId}/projects/${apk.projectId}/api-keys/${apk.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(service.delete)
      .toBeCalledWith(apk.adminId, apk.projectId, [apk.id]);
  });

  it('should delete project (me special id)', async () => {
    const apk = apiKeys[0];

    await request.delete(`/me/projects/${apk.projectId}/api-keys/${apk.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(service.delete)
      .toBeCalledWith(apk.adminId, apk.projectId, [apk.id]);
  });

  it('should return 401 (not authenticated)', async () => {
    const apk = apiKeys[0];

    await request.delete(`/${apk.adminId}/projects/${apk.projectId}/api-keys/${apk.id}`)
      .expect(401);

    expect(service.delete).not.toBeCalled();
  });

  it('should return 403 (missing permissions)', async () => {
    const apk = apiKeys[0];

    await request.delete(`/${apk.adminId}/projects/${apk.projectId}/api-keys/${apk.id}`)
      .set('Authorization', `Bearer ${basicToken}`)
      .expect(403);

    expect(service.delete).not.toBeCalled();
  });
});

describe('DELETE /:userId/projects/:projectId/api-keys', () => {
  let ids: string[];

  beforeEach(() => {
    jest.spyOn(service, 'delete');
    ids = apiKeys.filter(apk => apk.projectId === projects[0].id).map(apk => apk.id);
  });

  // Tests
  it('should delete project', async () => {
    await request.delete(`/${admin.user_id}/projects/${projects[0].id}/api-keys`)
      .query({ ids: ids })
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(service.delete)
      .toBeCalledWith(admin.user_id, projects[0].id, ids);
  });

  it('should delete project (me special id)', async () => {
    await request.delete(`/me/projects/${projects[0].id}/api-keys`)
      .query({ ids: ids })
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(service.delete)
      .toBeCalledWith(admin.user_id, projects[0].id, ids);
  });

  it('should return 401 (not authenticated)', async () => {
    const apk = apiKeys[0];

    await request.delete(`/${apk.adminId}/projects/${apk.projectId}/api-keys`)
      .expect(401);

    expect(service.delete).not.toBeCalled();
  });

  it('should return 403 (missing permissions)', async () => {
    const apk = apiKeys[0];

    await request.delete(`/${apk.adminId}/projects/${apk.projectId}/api-keys`)
      .set('Authorization', `Bearer ${basicToken}`)
      .expect(403);

    expect(service.delete).not.toBeCalled();
  });
});
