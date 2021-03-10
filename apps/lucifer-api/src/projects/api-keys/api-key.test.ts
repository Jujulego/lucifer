import { Test, TestingModule } from '@nestjs/testing'
import { Connection } from 'typeorm';

import { DatabaseModule } from '../../db/database.module';
import { LocalUser } from '../../users/local-user.entity';
import { UsersService } from '../../users/users.service';
import { Project } from '../project.entity';

import { UsersServiceMock } from '../../../mocks/users-service.mock';

import { ApiKeyService } from './api-key.service';
import { ApiKey } from './api-key.entity';
import { ApiKeyModule } from './api-key.module';

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
      repoApk.create({ projectId: projects[0].id, label: 'test-01', key: 'test-01' }),
      repoApk.create({ projectId: projects[0].id, label: 'test-02', key: 'test-02' }),
      repoApk.create({ projectId: projects[1].id, label: 'test-03', key: 'test-03' }),
    ]);
  });
});

afterEach(async () => {
  jest.resetAllMocks();

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
});
