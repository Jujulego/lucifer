import { INestApplication } from '@nestjs/common';
import { ManagementClient } from 'auth0';
import { Connection, In } from 'typeorm';
import supertest from 'supertest';

import { ICreateProject, IUpdateProject } from '@lucifer/types';
import { LocalUser } from '../../src/users/local-user.entity';
import { Project } from '../../src/projects/project.entity';

import { generateTestToken, initTestingApp } from '../utils';
import { ManagementClientMock } from '../../mocks/management-client.mock';

// Server setup
let app: INestApplication;
let mgmtClient: ManagementClientMock;
let database: Connection;
let request: ReturnType<typeof supertest>;

beforeAll(async () => {
  app = await initTestingApp();
  mgmtClient = app.get(ManagementClient);

  // Start server
  request = supertest(app.getHttpServer());
  database = app.get(Connection);
});

afterAll(async () => {
  await app?.close();
});

// Setup data
let adminToken: string;
let basicToken: string;
let lcu: LocalUser;
let projects: Project[];

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
  adminToken = await generateTestToken(admin.user_id, ['create:projects', 'read:projects', 'update:projects', 'delete:projects']);
  basicToken = await generateTestToken(basic.user_id, []);

  // Mocks
  mgmtClient.mockSetUsers([admin, basic]);

  // Data
  await database.transaction(async (manager) => {
    const repoLcu = manager.getRepository(LocalUser);
    const repoPrj = manager.getRepository(Project);

    lcu = await repoLcu.save(
      repoLcu.create({ id: admin.user_id })
    );

    projects = await repoPrj.save([
      repoPrj.create({ id: 'test-1', adminId: lcu.id, name: 'Test 1' }),
      repoPrj.create({ id: 'test-2', adminId: lcu.id, name: 'Test 2' }),
    ]);
  });
});

afterEach(async () => {
  const repoLcu = database.getRepository(LocalUser);
  const repoPrj = database.getRepository(Project);

  await repoPrj.delete({ id: In(projects.map(prj => prj.id)) });
  await repoLcu.delete(lcu.id);
});

// Test suites
describe('POST /:userId/projects', () => {
  const data: ICreateProject = {
    id:   'test-project',
    name: 'Test Project'
  };

  afterEach(async () => {
    const repoPrj = database.getRepository(Project);
    await repoPrj.delete({ id: data.id });
  });

  // Tests
  it('should return created project', async () => {
    const rep = await request.post(`/${admin.user_id}/projects`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(data)
      .expect(201)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual({
      id:      data.id,
      adminId: admin.user_id,
      name:    data.name,
      description: ''
    });
  });

  it('should return 400 (missing parameters)', async () => {
    const rep = await request.post(`/${admin.user_id}/projects`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({})
      .expect(400)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual({
      error: 'Bad Request',
      message: expect.arrayContaining([
        'id must be a string',
        'name must be a string',
      ]),
      statusCode: 400
    });
  });

  it('should return 400 (too long id & name)', async () => {
    const rep = await request.post(`/${admin.user_id}/projects`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        id:   'this-is-a-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-very-too-long-id',
        name: 'This as a very very very very very very very very very very very very very very very very very too long name'
      })
      .expect(400)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual({
      error: 'Bad Request',
      message: expect.arrayContaining([
        'id must be shorter than or equal to 100 characters',
        'name must be shorter than or equal to 100 characters',
      ]),
      statusCode: 400
    });
  });

  it('should return 400 (invalid id)', async () => {
    const rep = await request.post(`/${admin.user_id}/projects`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        id:   '!:;,?%*',
        name: 'Project name'
      })
      .expect(400)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual({
      error: 'Bad Request',
      message: expect.arrayContaining([
        'id must match /^[a-z0-9-]+$/ regular expression'
      ]),
      statusCode: 400
    });
  });

  it('should return 401 (not authenticated)', async () => {
    await request.post(`/${admin.user_id}/projects`)
      .expect(401);
  });

  it('should return 403 (missing permissions)', async () => {
    await request.post(`/${admin.user_id}/projects`)
      .set('Authorization', `Bearer ${basicToken}`)
      .expect(403);
  });

  it('should return 404 (unknown user)', async () => {
    await request.post('/not-a-user-id/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(data)
      .expect(404);
  });

  it('should return 409 (project with id already exists)', async () => {
    const prj = projects[0];

    const rep = await request.post(`/${prj.adminId}/projects`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ id: prj.id, name: prj.name })
      .expect(409);

    expect(rep.body).toEqual({
      error: 'Conflict',
      message: 'Project with id test-1 already exists',
      statusCode: 409
    });
  });
});

describe('GET /:userId/projects', () => {
  it('should return all user\'s projects', async () => {
    const rep = await request.get(`/${admin.user_id}/projects`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual(projects.map(prj => expect.objectContaining({
      id: prj.id
    })));
  });

  it('should return all user\'s projects (me special id)', async () => {
    const rep = await request.get('/me/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual(projects.map(prj => expect.objectContaining({
      id: prj.id
    })));
  });

  it('should return 401 (not authenticated)', async () => {
    await request.get(`/${admin.user_id}/projects`)
      .expect(401);
  });

  it('should return 403 (missing permissions)', async () => {
    await request.get(`/${admin.user_id}/projects`)
      .set('Authorization', `Bearer ${basicToken}`)
      .expect(403);
  });
});

describe('GET /:userId/projects/:id', () => {
  it('should return a project', async () => {
    const prj = projects[0];

    const rep = await request.get(`/${prj.adminId}/projects/${prj.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual({
      id:          prj.id,
      adminId:     prj.adminId,
      name:        prj.name,
      description: prj.description
    });
  });

  it('should return a project (me special id)', async () => {
    const prj = projects[0];

    const rep = await request.get(`/me/projects/${prj.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual(expect.objectContaining({
      id: prj.id,
    }));
  });

  it('should return 401 (not authenticated)', async () => {
    const prj = projects[0];

    await request.get(`/${prj.adminId}/projects/${prj.id}`)
      .expect(401);
  });

  it('should return 403 (missing permissions)', async () => {
    const prj = projects[0];

    await request.get(`/${prj.adminId}/projects/${prj.id}`)
      .set('Authorization', `Bearer ${basicToken}`)
      .expect(403);
  });

  it('should return 404 (unknown project)', async () => {
    const prj = projects[0];

    await request.get(`/${prj.adminId}/projects/not-a-project-id`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });

  it('should return 404 (unknown project for user)', async () => {
    const prj = projects[0];

    await request.get(`/not-a-user-id/projects/${prj.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });
});

describe('PUT /:userId/projects/:id', () => {
  const data: IUpdateProject = {
    name: 'Test Project',
    description: 'Test Project'
  };

  // Tests
  it('should update project', async () => {
    const prj = projects[0];

    const rep = await request.put(`/${prj.adminId}/projects/${prj.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(data)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual({ ...prj, ...data });
  });

  it('should update project (me special id)', async () => {
    const prj = projects[0];

    const rep = await request.put(`/me/projects/${prj.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(data)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual({ ...prj, ...data });
  });

  it('should return 400 (too long name)', async () => {
    const prj = projects[0];

    const rep = await request.put(`/me/projects/${prj.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'This as a very very very very very very very very very very very very very very very very very too long name'
      })
      .expect(400)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual({
      error: 'Bad Request',
      message: expect.arrayContaining([
        'name must be shorter than or equal to 100 characters',
      ]),
      statusCode: 400
    });
  });

  it('should return 401 (not authenticated)', async () => {
    const prj = projects[0];

    await request.put(`/${prj.adminId}/projects/${prj.id}`)
      .expect(401);
  });

  it('should return 403 (missing permissions)', async () => {
    const prj = projects[0];

    await request.put(`/${prj.adminId}/projects/${prj.id}`)
      .set('Authorization', `Bearer ${basicToken}`)
      .expect(403);
  });

  it('should return 404 (unknown project)', async () => {
    const prj = projects[0];

    await request.put(`/${prj.adminId}/projects/not-a-project-id`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });

  it('should return 404 (unknown project for user)', async () => {
    const prj = projects[0];

    await request.put(`/not-a-user-id/projects/${prj.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });
});

describe('DELETE /:userId/projects/:id', () => {
  it('should delete project', async () => {
    const prj = projects[0];

    await request.delete(`/${prj.adminId}/projects/${prj.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });

  it('should return 401 (not authenticated)', async () => {
    const prj = projects[0];

    await request.delete(`/${prj.adminId}/projects/${prj.id}`)
      .expect(401);
  });

  it('should return 403 (missing permissions)', async () => {
    const prj = projects[0];

    await request.delete(`/${prj.adminId}/projects/${prj.id}`)
      .set('Authorization', `Bearer ${basicToken}`)
      .expect(403);
  });
});
