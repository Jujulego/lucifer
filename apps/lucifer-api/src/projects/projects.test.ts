import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection } from 'typeorm';

import { IUpdateProject } from '@lucifer/types';
import { DatabaseModule } from '../db/database.module';
import { UsersService } from '../users/users.service';
import { LocalUser } from '../users/local-user.entity';
import { UsersServiceMock } from '../../mocks/users-service.mock';
import { generateTestContext } from '../../tests/utils';

import { ProjectsModule } from './projects.module';
import { ProjectsService } from './projects.service';
import { ProjectMemberService } from './project-member.service';
import { Project } from './project.entity';
import { ProjectMember } from './project-member.entity';

// Load services
let app: TestingModule;
let service: ProjectsService;
let database: Connection;

beforeAll(async () => {
  app = await Test.createTestingModule({
    imports: [
      DatabaseModule,
      ProjectsModule
    ]
  })
    .overrideProvider(UsersService).useClass(UsersServiceMock)
    .compile();

  service = app.get(ProjectsService);
  database = app.get(Connection);
});

afterAll(async () => {
  await app?.close();
});

// Test data & Mocks
let admins: LocalUser[];
let projects: Project[];

beforeEach(async () => {
  // Create test entities
  await database.transaction(async manager => {
    const repoLcu = manager.getRepository(LocalUser);
    const repoPrj = manager.getRepository(Project);

    admins = await repoLcu.save([
      repoLcu.create({ id: 'tests|projects-01' }),
      repoLcu.create({ id: 'tests|projects-02' }),
    ]);

    projects = await repoPrj.save([
      repoPrj.create({ id: 'test-projects-1', name: 'Test #1', members: [] }),
      repoPrj.create({ id: 'test-projects-2', name: 'Test #2', members: [] }),
      repoPrj.create({ id: 'test-projects-3', name: 'Test #3', members: [] })
    ]);
  });
});

afterEach(async () => {
  jest.resetAllMocks();

  // Remove test entities
  const repoLcu = database.getRepository(LocalUser);
  const repoPrj = database.getRepository(Project);

  await repoPrj.delete(projects.map(prj => prj.id));
  await repoLcu.delete(admins.map(adm => adm.id));
});

// Tests suites
describe('ProjectsService.create', () => {
  let members: ProjectMemberService;

  beforeEach(() => {
    members = app.get(ProjectMemberService);

    jest.spyOn(members, 'add')
      .mockImplementation(async (userId: string, projectId: string, admin = false) => ({ userId, projectId, admin }) as ProjectMember)
  });

  // Tests
  it('should create a new project', async () => {
    const project = await service.create(generateTestContext('test-projects'), { id: 'test-projects-4', name: 'Test #4' });

    try {
      expect(project).toEqual({
        id:          'test-projects-4',
        name:        'Test #4',
        description: ''
      });
    } finally {
      const repo = database.getRepository(Project);
      await repo.delete(project.id);
    }
  });

  it('should fail to create a new project', async () => {
    await expect(service.create(generateTestContext('test-projects'),{ id: 'test-projects-1', name: 'Test #1' }))
      .rejects.toEqual(new ConflictException('Project with id test-projects-1 already exists'))
  });
});

describe('ProjectsService.list', () => {
  // Tests
  it('should return all projects', async () => {
    await expect(service.list(generateTestContext('test-projects', ['read:projects']), {}))
      .resolves.toEqual(expect.arrayContaining(projects));
  });
});

describe('ProjectsService.get', () => {
  // Tests
  it('should return a project', async () => {
    const prj = projects[0];

    // Call
    await expect(service.get(prj.id))
      .resolves.toEqual(prj);
  });

  it('should throw if project does not exists', async () => {
    // Call
    await expect(service.get('not-a-project-id'))
      .rejects.toEqual(new NotFoundException('Project not-a-project-id not found'));
  });
});

describe('ProjectsService.update', () => {
  const update: IUpdateProject = {
    name: 'updated',
    description: 'updated'
  };

  // Tests
  it('should update a project', async () => {
    const prj = projects[0];

    // Call
    await expect(service.update(prj.id, update))
      .resolves.toEqual({
        id:          prj.id,
        name:        update.name,
        description: update.description,
        members:     []
      });
  });

  it('should throw if project does not exists', async () => {
    // Call
    await expect(service.update('not-a-project-id', update))
      .rejects.toEqual(new NotFoundException('Project not-a-project-id not found'));
  });
});

describe('ProjectsService.delete', () => {
  let prj: Project;

  // Create a project
  beforeEach(async () => {
    const repo = database.getRepository(Project);

    prj = await repo.save(
      repo.create({ id: 'test-projects-delete', name: 'Test delete' })
    );
  });

  afterEach(async () => {
    const repo = database.getRepository(Project);

    await repo.delete(prj.id);
  });

  // Tests
  it('should delete given project', async () => {
    await expect(service.delete([prj.id]))
      .resolves.toBe(1);
  });
});
