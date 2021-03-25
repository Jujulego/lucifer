import { INestApplication } from '@nestjs/common';
import { ManagementClient } from 'auth0';
import { Connection } from 'typeorm';
import supertest from 'supertest';

import { ICreateProject, IUpdateProject } from '@lucifer/types';
import { should } from '@lucifer/utils';

import { LocalUser } from '../../src/users/local-user.entity';
import { Project } from '../../src/projects/project.entity';
import { ProjectMember } from '../../src/projects/project-member.entity';
import { ProjectsService } from '../../src/projects/projects.service';

import { generateTestToken, initTestingApp } from '../utils';
import { ManagementClientMock } from '../../mocks/management-client.mock';

// Server setup
let app: INestApplication;
let mgmtClient: ManagementClientMock;
let database: Connection;
let service: ProjectsService;
let request: ReturnType<typeof supertest>;

beforeAll(async () => {
  app = await initTestingApp();
  mgmtClient = app.get(ManagementClient);

  // Start server
  request = supertest(app.getHttpServer());
  database = app.get(Connection);
  service = app.get(ProjectsService);
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
  user_id: 'tests|api-projects-admin',
  email:   'admin@test.com',
  name:    'Admin'
};

const basic = {
  user_id: 'tests|api-projects-basic',
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
    const repoMmb = manager.getRepository(ProjectMember);

    lcu = await repoLcu.save(
      repoLcu.create({ id: admin.user_id })
    );

    projects = await repoPrj.save([
      repoPrj.create({ id: 'test-api-projects-1', name: 'Test 1', members: [] }),
      repoPrj.create({ id: 'test-api-projects-2', name: 'Test 2', members: [] }),
    ]);

    projects[0].members = await repoMmb.save([
      repoMmb.create({ userId: admin.user_id, projectId: projects[0].id, admin: true })
    ]);
  });
});

afterEach(async () => {
  const repoLcu = database.getRepository(LocalUser);
  const repoPrj = database.getRepository(Project);

  await repoPrj.delete(projects.map(prj => prj.id));
  await repoLcu.delete(lcu.id);
});

// Test suites
describe('POST /projects', () => {
  const data: ICreateProject = {
    id:   'test-api-projects',
    name: 'Test Project'
  };

  afterEach(async () => {
    const repoPrj = database.getRepository(Project);
    await repoPrj.delete(data.id);
  });

  // Tests
  it('should return created project', async () => {
    const rep = await request.post('/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(data)
      .expect(201)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual({
      id:          data.id,
      name:        data.name,
      description: '',
      members: [
        { userId: admin.user_id, projectId: data.id, admin: true }
      ]
    });
  });

  it('should return 400 (missing parameters)', async () => {
    const rep = await request.post('/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({})
      .expect(400)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual(should.be.badRequest(
      { path: 'id', type: 'required', errors: [expect.any(String)] },
      { path: 'name', type: 'required', errors: [expect.any(String)] },
    ));
  });

  it('should return 400 (too long id & name)', async () => {
    const rep = await request.post('/projects')
      .set('Authorization', `Bearer ${adminToken}`)
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
  });

  it('should return 400 (invalid id)', async () => {
    const rep = await request.post('/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        id:   '!:;,?%*',
        name: 'Project name'
      })
      .expect(400)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual(should.be.badRequest(
      { path: 'id', type: 'matches', errors: [expect.any(String)] }
    ));
  });

  it('should return 401 (not authenticated)', async () => {
    await request.post('/projects')
      .expect(401);
  });

  it('should return 403 (missing permissions)', async () => {
    await request.post('/projects')
      .set('Authorization', `Bearer ${basicToken}`)
      .expect(403);
  });

  it('should return 409 (project with id already exists)', async () => {
    const prj = projects[0];

    const rep = await request.post('/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ id: prj.id, name: prj.name })
      .expect(409);

    expect(rep.body).toEqual(should.be.httpError(409, `Project with id ${prj.id} already exists`));
  });
});

describe('GET /projects', () => {
  it('should return all projects', async () => {
    const rep = await request.get('/projects')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual(projects.map(prj => expect.objectContaining({
      id: prj.id
    })));
  });

  it('should return 401 (not authenticated)', async () => {
    await request.get('/projects')
      .expect(401);
  });
});

describe('GET /projects/:id', () => {
  it('should return a project', async () => {
    const prj = projects[0];

    const rep = await request.get(`/projects/${prj.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual({
      id:          prj.id,
      name:        prj.name,
      description: prj.description,
      members:     prj.members
    });
  });

  it('should return 401 (not authenticated)', async () => {
    const prj = projects[0];

    await request.get(`/projects/${prj.id}`)
      .expect(401);
  });

  it('should return 403 (missing permissions)', async () => {
    const prj = projects[0];

    await request.get(`/projects/${prj.id}`)
      .set('Authorization', `Bearer ${basicToken}`)
      .expect(403);
  });

  it('should return 404 (unknown project)', async () => {
    await request.get('/projects/not-a-project-id')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);
  });
});

describe('PUT /projects/:id', () => {
  const data: IUpdateProject = {
    name: 'Test Project',
    description: 'Test Project'
  };

  beforeEach(() => {
    jest.spyOn(service, 'update');
  });

  // Tests
  it('should update project', async () => {
    const prj = projects[0];

    const rep = await request.put(`/projects/${prj.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(data)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(rep.body).toEqual({ ...prj, ...data });
    expect(service.update).toBeCalledWith(prj.id, data);
  });

  it('should return 400 (too long name)', async () => {
    const prj = projects[0];

    const rep = await request.put(`/projects/${prj.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
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
    const prj = projects[0];

    await request.put(`/projects/${prj.id}`)
      .expect(401);

    expect(service.update).not.toBeCalled();
  });

  it('should return 403 (missing permissions)', async () => {
    const prj = projects[0];

    await request.put(`/projects/${prj.id}`)
      .set('Authorization', `Bearer ${basicToken}`)
      .expect(403);

    expect(service.update).not.toBeCalled();
  });

  it('should return 404 (unknown project)', async () => {
    await request.put('/projects/not-a-project-id')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(404);

    expect(service.update).toBeCalledWith('not-a-project-id', {});
  });
});

describe('DELETE /projects/:id', () => {
  beforeEach(() => {
    jest.spyOn(service, 'delete');
  });

  // Tests
  it('should delete project', async () => {
    const prj = projects[0];

    await request.delete(`/projects/${prj.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(service.delete)
      .toBeCalledWith([prj.id]);
  });

  it('should return 401 (not authenticated)', async () => {
    const prj = projects[0];

    await request.delete(`/projects/${prj.id}`)
      .expect(401);

    expect(service.delete).not.toBeCalled();
  });

  it('should return 403 (missing permissions)', async () => {
    const prj = projects[0];

    await request.delete(`/projects/${prj.id}`)
      .set('Authorization', `Bearer ${basicToken}`)
      .expect(403);

    expect(service.delete).not.toBeCalled();
  });
});

describe('DELETE /projects', () => {
  let ids: string[];

  beforeEach(() => {
    jest.spyOn(service, 'delete');
    ids = projects.map(prj => prj.id);
  });

  // Tests
  it('should delete project', async () => {
    await request.delete('/projects')
      .query({ ids: ids })
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(service.delete)
      .toBeCalledWith(ids);
  });

  it('should return 401 (not authenticated)', async () => {
    await request.delete('/projects')
      .expect(401);

    expect(service.delete).not.toBeCalled();
  });

  it('should return 403 (missing permissions)', async () => {
    await request.delete('/projects')
      .set('Authorization', `Bearer ${basicToken}`)
      .expect(403);

    expect(service.delete).not.toBeCalled();
  });
});
