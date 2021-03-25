import { Test, TestingModule } from '@nestjs/testing'
import { Connection } from 'typeorm';
import bcrypt from 'bcrypt';

import { DatabaseModule } from '../../db/database.module';
import { LocalUser } from '../../users/local-user.entity';
import { UsersService } from '../../users/users.service';
import { Project } from '../project.entity';
import { ProjectsService } from '../projects.service';

import { UsersServiceMock } from '../../../mocks/users-service.mock';

import { ApiKeyService } from './api-key.service';
import { ApiKey } from './api-key.entity';
import { ApiKeyModule } from './api-key.module';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

// Load services
let app: TestingModule;
let service: ApiKeyService;
let database: Connection;

beforeAll(async () => {
  app = await Test.createTestingModule({
    imports: [
      DatabaseModule,
      ApiKeyModule
    ]
  })
    .overrideProvider(UsersService).useClass(UsersServiceMock)
    .compile();

  service = app.get(ApiKeyService);
  database = app.get(Connection);
});

afterAll(async() => {
  await app?.close();
});

// Test data
let admin: LocalUser;
let projects: Project[];
let apiKeys: ApiKey[];

beforeEach(async () => {
  jest.resetAllMocks();
  jest.restoreAllMocks();

  // Create test entities
  await database.transaction(async manager => {
    const repoLcu = manager.getRepository(LocalUser);
    const repoPrj = manager.getRepository(Project);
    const repoApk = manager.getRepository(ApiKey);

    admin = await repoLcu.save(
      repoLcu.create({ id: 'tests|api-keys-01' })
    );

    projects = await repoPrj.save([
      repoPrj.create({ id: 'test-api-keys-1', name: 'Test #1' }),
      repoPrj.create({ id: 'test-api-keys-2', name: 'Test #2' }),
    ]);

    apiKeys = await repoApk.save([
      repoApk.create({ projectId: projects[0].id, label: 'test-01', key: await bcrypt.hash('test-01', 1) }),
      repoApk.create({ projectId: projects[0].id, label: 'test-02', key: await bcrypt.hash('test-02', 1) }),
      repoApk.create({ projectId: projects[1].id, label: 'test-03', key: await bcrypt.hash('test-03', 1) }),
    ]);
  });
});

afterEach(async () => {
  // Remove test entities
  const repoLcu = database.getRepository(LocalUser);
  const repoPrj = database.getRepository(Project);
  const repoApk = database.getRepository(ApiKey);

  await repoApk.delete(apiKeys.map(apk => apk.id));
  await repoPrj.delete(projects.map(prj => prj.id));
  await repoLcu.delete(admin.id);
});

// Tests suites
describe('ApiKeyService.create', () => {
  // Tests
  it('should create a new api key', async () => {
    const apiKey = await service.create(projects[1].id, { label: 'test' });

    try {
      expect(apiKey).toEqual({
        id:        expect.any(String),
        projectId: projects[1].id,
        key:       expect.any(String),
        label:     'test'
      });
    } finally {
      const repo = database.getRepository(ApiKey);
      await repo.delete(apiKey.id);
    }
  });

  it('should throw if project doesn\'t exsits', async () => {
    jest.spyOn(app.get(ProjectsService), 'get')
      .mockRejectedValue(new NotFoundException());

    // Try to create
    await expect(service.create(projects[1].id, { label: 'test' }))
      .rejects.toBeInstanceOf(NotFoundException);
  });
});

describe('ApiKeyService.list', () => {
  // Tests
  it('should return all project\'s api keys', async () => {
    await expect(service.list(projects[0].id))
      .resolves.toEqual(apiKeys.filter(apk => apk.projectId === projects[0].id));
  });
});

describe('ApiKeyService.get', () => {
  // Tests
  it('should return an api-key', async () => {
    const apk = apiKeys[0];

    await expect(service.get(apk.projectId, apk.id))
      .resolves.toEqual(apk);
  });

  it('should throw if wrong project', async () => {
    const apk = apiKeys[0];

    await expect(service.get('not-a-project-id', apk.id))
      .rejects.toEqual(new NotFoundException(`Api key ${apk.id} not found`));
  });

  it('should throw if wrong id', async () => {
    const apk = apiKeys[0];

    await expect(service.get(apk.projectId, '00000000-0000-0000-0000-000000000000'))
      .rejects.toEqual(new NotFoundException('Api key 00000000-0000-0000-0000-000000000000 not found'));
  });
});

describe('ApiKeyService.check', () => {
  // Tests
  it('should return an api-key', async () => {
    const apk = apiKeys[0];

    await expect(service.check(apk.id, 'test-01'))
      .resolves.toEqual(apk);
  });

  it('should throw if wrong id', async () => {
    await expect(service.check('00000000-0000-0000-0000-000000000000', 'test-01'))
      .rejects.toEqual(new UnauthorizedException());
  });

  it('should throw if wrong secret', async () => {
    const apk = apiKeys[0];

    await expect(service.check(apk.id, 'wrong-secret'))
      .rejects.toEqual(new UnauthorizedException());
  });
});
