import { INestApplication } from '@nestjs/common';
import { ManagementClient } from 'auth0';
import { Connection, In } from 'typeorm';
import supertest from 'supertest';

import { IApiKeyWithKey, ICreateVariable, IUpdateVariable } from '@lucifer/types';
import { should } from '@lucifer/utils';

import { LocalUser } from '../../src/users/local-user.entity';
import { Project } from '../../src/projects/project.entity';
import { ApiKeyService } from '../../src/projects/api-keys/api-key.service';
import { Variable } from '../../src/projects/variables/variable.entity';
import { VariablesService } from '../../src/projects/variables/variables.service';

import { generateTestToken, initTestingApp } from '../utils';
import { ManagementClientMock } from '../../mocks/management-client.mock';
import { ApiKeyServiceMock } from '../../mocks/api-key-service.mock';

// Server setup
let app: INestApplication;
let mgmtClient: ManagementClientMock;
let apkMock: ApiKeyServiceMock;
let database: Connection;
let service: VariablesService;
let request: ReturnType<typeof supertest>;

beforeAll(async () => {
  app = await initTestingApp();
  mgmtClient = app.get(ManagementClient);

  // Start server
  request = supertest(app.getHttpServer());
  database = app.get(Connection);
  service = app.get(VariablesService);
  apkMock = app.get(ApiKeyService);
});

afterAll(async () => {
  await app?.close();
});

// Setup data
let adminToken: string;
let basicToken: string;
let projectApk: IApiKeyWithKey;
let basicApk: IApiKeyWithKey;
let lcu: LocalUser;
let projects: Project[];
let variables: Variable[];

const admin = {
  user_id: 'tests|api-variables-admin',
  email:   'admin@test.com',
  name:    'Admin'
};

const basic = {
  user_id: 'tests|api-variables-basic',
  email:   'basic@test.com',
  name:    'Basic'
};

beforeEach(async () => {
  jest.resetAllMocks();
  jest.restoreAllMocks();

  // Get tokens
  adminToken = await generateTestToken(admin.user_id, ['create:variables', 'read:variables', 'update:variables', 'delete:variables']);
  basicToken = await generateTestToken(basic.user_id, []);

  // Mocks
  mgmtClient.mockSetUsers([admin, basic]);

  // Data
  await database.transaction(async (manager) => {
    const repoLcu = manager.getRepository(LocalUser);
    const repoPrj = manager.getRepository(Project);
    const repoVrb = manager.getRepository(Variable);

    lcu = await repoLcu.save(
      repoLcu.create({ id: admin.user_id })
    );

    projects = await repoPrj.save([
      repoPrj.create({ id: 'test-api-variables-1', name: 'Test 1' }),
      repoPrj.create({ id: 'test-api-variables-2', name: 'Test 2' }),
    ]);

    variables = await repoVrb.save([
      repoVrb.create({ projectId: projects[0].id, id: 'test-1', name: 'TEST1', value: '1' }),
      repoVrb.create({ projectId: projects[0].id, id: 'test-2', name: 'TEST2', value: '2' }),
      repoVrb.create({ projectId: projects[1].id, id: 'test-1', name: 'TEST1', value: '1' }),
    ]);
  });

  // Get api-key
  apkMock.mockReset();
  projectApk = apkMock.mockApiKey('mock-key', projects[0].id);
  basicApk = apkMock.mockApiKey('mock-key', 'mock-project');

});

afterEach(async () => {
  const repoLcu = database.getRepository(LocalUser);
  const repoPrj = database.getRepository(Project);
  const repoVrb = database.getRepository(Variable);

  await repoVrb.delete({ id: In(variables.map(vrb => vrb.id)) });
  await repoPrj.delete({ id: In(projects.map(prj => prj.id)) });
  await repoLcu.delete(lcu.id);
});

// Test suites
describe('POST /projects/:projectId/variables', () => {
  const data: ICreateVariable = {
    id:    'test-2',
    name:  'TEST2',
    value: '2'
  };

  beforeEach(() => {
    jest.spyOn(service, 'create');
  });

  afterEach(async () => {
    const repoVrb = database.getRepository(Variable);
    await repoVrb.delete({ id: data.id });
  });

  // Tests
  it('should return created variable', async () => {
    const rep = await request.post(`/projects/${projects[1].id}/variables`)
      .auth(adminToken, { type: 'bearer' })
      .send(data)
      .expect(201)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual({
      projectId: projects[1].id,
      id:        data.id,
      name:      data.name,
      value:     data.value
    });
    expect(service.create).toBeCalledWith(projects[1].id, data);
  });

  it('should return 400 (missing parameters)', async () => {
    const rep = await request.post(`/projects/${projects[1].id}/variables`)
      .auth(adminToken, { type: 'bearer' })
      .send({})
      .expect(400)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual(should.be.badRequest(
      { path: 'id', type: 'required', errors: [expect.any(String)] },
      { path: 'name', type: 'required', errors: [expect.any(String)] },
      { path: 'value', type: 'required', errors: [expect.any(String)] },
    ));
    expect(service.create).not.toBeCalled();
  });

  it('should return 400 (too long id & name)', async () => {
    const rep = await request.post(`/projects/${projects[1].id}/variables`)
      .auth(adminToken, { type: 'bearer' })
      .send({
        id:   'this-is-a-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-too-long-id',
        name: 'This as a very very very very very very very very very very very very very very very very very too long name'
      })
      .expect(400)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual(should.be.badRequest(
      { path: 'id', type: 'max', errors: [expect.any(String)] },
      { path: 'name', type: 'max', errors: [expect.any(String)] },
    ));
    expect(service.create).not.toBeCalled();
  });

  it('should return 400 (invalid id)', async () => {
    const rep = await request.post(`/projects/${projects[1].id}/variables`)
      .auth(adminToken, { type: 'bearer' })
      .send({ ...data,
        id:   '!:;,?%*'
      })
      .expect(400)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual(should.be.badRequest(
      { path: 'id', type: 'matches', errors: [expect.any(String)] }
    ));
    expect(service.create).not.toBeCalled();
  });

  it('should return 401 (not authenticated)', async () => {
    await request.post(`/projects/${projects[1].id}/variables`)
      .expect(401);

    expect(service.create).not.toBeCalled();
  });

  it('should return 403 (missing permissions)', async () => {
    await request.post(`/projects/${projects[1].id}/variables`)
      .auth(basicToken, { type: 'bearer' })
      .expect(403);

    expect(service.create).not.toBeCalled();
  });

  it('should return 403 (not allowed to api-keys)', async () => {
    await request.post(`/projects/${projects[1].id}/variables`)
      .auth(basicApk.id, basicApk.key)
      .expect(403);

    expect(service.create).not.toBeCalled();
  });

  it('should return 404 (unknown project)', async () => {
    await request.post(`/projects/wrong-project/variables`)
      .auth(adminToken, { type: 'bearer' })
      .send(data)
      .expect(404);

    expect(service.create).toBeCalledWith('wrong-project', data);
  });

  it('should return 409 (project with id already exists)', async () => {
    const vrb = variables[0];
    const data = { id: vrb.id, name: vrb.name, value: vrb.value };

    const rep = await request.post(`/projects/${vrb.projectId}/variables`)
      .auth(adminToken, { type: 'bearer' })
      .send(data)
      .expect(409);

    expect(rep.body).toEqual(should.be.httpError(409, 'Variable with id test-1 already exists.'));
    expect(service.create).toBeCalledWith(vrb.projectId, data);
  });
});

describe('GET /projects/:projectId/variables', () => {
  it('should return all project\'s variables', async () => {
    const rep = await request.get(`/projects/${projects[0].id}/variables`)
      .auth(adminToken, { type: 'bearer' })
      .expect(200)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual(
      variables.filter(vrb => vrb.projectId === projects[0].id)
        .map(vrb => expect.objectContaining({
          id: vrb.id
        }))
    );
  });

  it('should return all project\'s variables (api-key access)', async () => {
    const rep = await request.get(`/projects/${projects[0].id}/variables`)
      .auth(projectApk.id, projectApk.key)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual(
      variables.filter(vrb => vrb.projectId === projects[0].id)
        .map(vrb => expect.objectContaining({
          id: vrb.id
        }))
    );
  });

  it('should return 401 (not authenticated)', async () => {
    await request.get(`/projects/${projects[0].id}/variables`)
      .expect(401);
  });

  it('should return 403 (missing permissions)', async () => {
    await request.get(`/projects/${projects[0].id}/variables`)
      .auth(basicToken, { type: 'bearer' })
      .expect(403);
  });

  it('should return 403 (api-key miss permissions)', async () => {
    await request.get(`/projects/${projects[0].id}/variables`)
      .auth(basicApk.id, basicApk.key)
      .expect(403);
  });
});

describe('PUT /projects/:projectId/variables/:id', () => {
  const data: IUpdateVariable = {
    name:  'UPDATED',
    value: 'updated'
  };

  beforeEach(() => {
    jest.spyOn(service, 'update');
  });

  // Tests
  it('should update variable', async () => {
    const vrb = variables[0];

    const rep = await request.put(`/projects/${vrb.projectId}/variables/${vrb.id}`)
      .auth(adminToken, { type: 'bearer' })
      .send(data)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual({ ...vrb, ...data });
    expect(service.update).toBeCalledWith(vrb.projectId, vrb.id, data);
  });

  it('should return 400 (too long name)', async () => {
    const vrb = variables[0];

    const rep = await request.put(`/projects/${vrb.projectId}/variables/${vrb.id}`)
      .auth(adminToken, { type: 'bearer' })
      .send({
        name: 'This as a very very very very very very very very very very very very very very very very very too long name'
      })
      .expect(400)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual(should.be.badRequest(
      { path: 'name', type: 'max', errors: [expect.any(String)] }
    ));
    expect(service.update).not.toBeCalled();
  });

  it('should return 401 (not authenticated)', async () => {
    const vrb = variables[0];

    await request.put(`/projects/${vrb.projectId}/variables/${vrb.id}`)
      .expect(401);

    expect(service.update).not.toBeCalled();
  });

  it('should return 403 (missing permissions)', async () => {
    const vrb = variables[0];

    await request.put(`/projects/${vrb.projectId}/variables/${vrb.id}`)
      .auth(basicToken, { type: 'bearer' })
      .expect(403);

    expect(service.update).not.toBeCalled();
  });

  it('should return 403 (api-key miss permissions)', async () => {
    const vrb = variables[0];

    await request.put(`/projects/${vrb.projectId}/variables/${vrb.id}`)
      .auth(projectApk.id, projectApk.key)
      .expect(403);

    expect(service.update).not.toBeCalled();
  });

  it('should return 404 (unknown variable)', async () => {
    const vrb = variables[0];

    await request.put(`/projects/${vrb.projectId}/variables/not-a-variable-id/`)
      .auth(adminToken, { type: 'bearer' })
      .expect(404);

    expect(service.update).toBeCalledWith(vrb.projectId, 'not-a-variable-id', {});
  });

  it('should return 404 (unknown project)', async () => {
    const vrb = variables[0];

    await request.put(`/projects/not-a-project-id/variables/${vrb.id}`)
      .auth(adminToken, { type: 'bearer' })
      .expect(404);

    expect(service.update).toBeCalledWith('not-a-project-id', vrb.id, {});
  });
});

describe('DELETE /projects/:projectsId/variables/:id', () => {
  beforeEach(() => {
    jest.spyOn(service, 'delete');
  });

  // Tests
  it('should delete variable', async () => {
    const vrb = variables[0];

    await request.delete(`/projects/${vrb.projectId}/variables/${vrb.id}`)
      .auth(adminToken, { type: 'bearer' })
      .expect(200);

    expect(service.delete)
      .toBeCalledWith(vrb.projectId, [vrb.id]);
  });

  it('should return 401 (not authenticated)', async () => {
    const vrb = variables[0];

    await request.delete(`/projects/${vrb.projectId}/variables/${vrb.id}`)
      .expect(401);

    expect(service.delete).not.toBeCalled();
  });

  it('should return 403 (missing permissions)', async () => {
    const vrb = variables[0];

    await request.delete(`/projects/${vrb.projectId}/variables/${vrb.id}`)
      .auth(basicToken, { type: 'bearer' })
      .expect(403);

    expect(service.delete).not.toBeCalled();
  });

  it('should return 403 (api-key miss permissions)', async () => {
    const vrb = variables[0];

    await request.delete(`/projects/${vrb.projectId}/variables/${vrb.id}`)
      .auth(projectApk.id, projectApk.key)
      .expect(403);

    expect(service.delete).not.toBeCalled();
  });
});

describe('DELETE /projects/:projectsId/variables', () => {
  let ids: string[];
  let prj: Project;

  beforeEach(() => {
    jest.spyOn(service, 'delete');

    prj = projects[0];
    ids = variables.filter(vrb => vrb.projectId === prj.id)
      .map(vrb => vrb.id);
  });

  // Tests
  it('should delete variable', async () => {
    await request.delete(`/projects/${prj.id}/variables`)
      .query({ ids: ids })
      .auth(adminToken, { type: 'bearer' })
      .expect(200);

    expect(service.delete)
      .toBeCalledWith(prj.id, ids);
  });

  it('should return 401 (not authenticated)', async () => {
    await request.delete(`/projects/${prj.id}/variables`)
      .expect(401);

    expect(service.delete).not.toBeCalled();
  });

  it('should return 403 (missing permissions)', async () => {
    await request.delete(`/projects/${prj.id}/variables`)
      .auth(basicToken, { type: 'bearer' })
      .expect(403);

    expect(service.delete).not.toBeCalled();
  });

  it('should return 403 (api-key miss permissions)', async () => {
    await request.delete(`/projects/${prj.id}/variables`)
      .auth(projectApk.id, projectApk.key)
      .expect(403);

    expect(service.delete).not.toBeCalled();
  });
});
