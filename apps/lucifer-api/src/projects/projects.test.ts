import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection, In } from 'typeorm';

import { DatabaseModule } from '../db/database.module';
import { UsersService } from '../users/users.service';
import { LocalUser } from '../users/local-user.entity';
import { UsersServiceMock } from '../../mocks/users-service.mock';

import { ProjectsModule } from './projects.module';
import { ProjectsService } from './projects.service';
import { Project } from './project.entity';
import { plainToClass } from 'class-transformer';
import { UpdateProject } from './project.schema';

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
      repoPrj.create({ adminId: admins[0].id, id: 'test-1', name: 'Test #1' }),
      repoPrj.create({ adminId: admins[0].id, id: 'test-2', name: 'Test #2' }),
      repoPrj.create({ adminId: admins[1].id, id: 'test-3', name: 'Test #3' })
    ]);
  });
});

afterEach(async () => {
  jest.resetAllMocks();

  // Remove test entities
  const repoLcu = database.getRepository(LocalUser);
  const repoPrj = database.getRepository(Project);

  await repoPrj.delete({ id: In(projects.map(mch => mch.id)) });
  await repoLcu.delete(admins.map(own => own.id));
});

// Tests suites
describe('ProjectsService.create', function() {
  // Tests
  it('should create a new project', async () => {
    const project = await service.create(admins[1].id, { id: 'test-4', name: 'Test #4' });

    try {
      expect(project).toEqual({
        adminId: admins[1].id,
        id:      'test-4',
        name:    'Test #4',
        description: ''
      });
    } finally {
      const repo = database.getRepository(Project);
      await repo.delete({
        adminId: project.adminId,
        id: project.id
      });
    }
  });

  it('should fail to create a new project', async () => {
    await expect(service.create(admins[0].id, { id: 'test-1', name: 'Test #1' }))
      .rejects.toEqual(new ConflictException('Project with id test-1 already exists'))
  });
});

describe('ProjectsService.list', () => {
  // Tests
  it('should return all owner\'s machines', async () => {
    const adm = admins[0];

    // Call
    await expect(service.list(adm.id))
      .resolves.toEqual(
        projects.filter(prj => prj.adminId === adm.id)
      );
  });

  // Tests
  it('should empty array for unknown user', async () => {
    // Call
    await expect(service.list('unknown-user'))
      .resolves.toEqual([]);
  });
});

describe('ProjectsService.get', () => {
  // Tests
  it('should return a project', async () => {
    const prj = projects[0];

    // Call
    await expect(service.get(prj.adminId, prj.id))
      .resolves.toEqual(prj);
  });

  it('should throw if project does not exists', async () => {
    // Call
    await expect(service.get(admins[0].id, 'this-project-does-not-exists'))
      .rejects.toEqual(new NotFoundException('Project this-project-does-not-exists not found'));
  });

  it('should throw if project exists in another user', async () => {
    const prj = projects[0];

    // Call
    await expect(service.get(admins[1].id, prj.id))
      .rejects.toEqual(new NotFoundException(`Project ${prj.id} not found`));
  });
});

describe('ProjectsService.update', () => {
  const update = plainToClass(UpdateProject, {
    name: 'updated',
    description: 'updated'
  });

  // Tests
  it('should update a project', async () => {
    const prj = projects[0];

    // Call
    await expect(service.update(prj.adminId, prj.id, update))
      .resolves.toEqual({
        adminId: prj.adminId,
        id:      prj.id,
        name:    update.name,
        description: update.description
      });
  });

  it('should throw if project does not exists', async () => {
    // Call
    await expect(service.update(admins[0].id, 'this-project-does-not-exists', update))
      .rejects.toEqual(new NotFoundException('Project this-project-does-not-exists not found'));
  });

  it('should throw if project exists in another user', async () => {
    const prj = projects[0];

    // Call
    await expect(service.update(admins[1].id, prj.id, update))
      .rejects.toEqual(new NotFoundException(`Project ${prj.id} not found`));
  });
});

describe('ProjectsService.delete', () => {
  let prj: Project;

  // Create a project
  beforeEach(async () => {
    const repo = database.getRepository(Project);

    prj = await repo.save(
      repo.create({ adminId: admins[1].id, id: 'test-delete', name: 'Test delete' })
    );
  });

  afterEach(async () => {
    const repo = database.getRepository(Project);

    await repo.delete({
      adminId: prj.adminId,
      id: prj.id
    });
  });

  // Tests
  it('should delete given project', async () => {
    await expect(service.delete(prj.adminId, [prj.id]))
      .resolves.toBe(1);
  });
});
