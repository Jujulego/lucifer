import { Test, TestingModule } from '@nestjs/testing'
import { Connection, In } from 'typeorm';

import { DatabaseModule } from '../db/database.module';
import { UsersServiceMock } from '../../mocks/users-service.mock';

import { ApiKeyService } from './api-key.service';
import { ApiKey } from './api-key.entity';
import { LocalUser } from './local-user.entity';
import { UsersService } from './users.service';
import { UsersModule } from './users.module';

// Load services
let app: TestingModule;
let service: ApiKeyService;
let database: Connection;

beforeAll(async () => {
  app = await Test.createTestingModule({
    imports: [
      DatabaseModule,
      UsersModule
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
let users: LocalUser[];
let apiKeys: ApiKey[];

beforeEach(async () => {
  // Create test entities
  await database.transaction(async manager => {
    const repoLcu = manager.getRepository(LocalUser);
    const repoApk = manager.getRepository(ApiKey);

    users = await repoLcu.save([
      repoLcu.create({ id: 'tests|api-keys-01' }),
      repoLcu.create({ id: 'tests|api-keys-02' }),
    ]);

    apiKeys = await repoApk.save([
      repoApk.create({ userId: users[0].id, label: 'test-01', key: 'test-01' }),
      repoApk.create({ userId: users[0].id, label: 'test-02', key: 'test-02' }),
      repoApk.create({ userId: users[1].id, label: 'test-03', key: 'test-03' }),
    ]);
  });
});

afterEach(async () => {
  jest.resetAllMocks();

  // Remove test entities
  const repoLcu = database.getRepository(LocalUser);
  const repoApk = database.getRepository(ApiKey);

  await repoApk.delete({ userId: In(users.map(usr => usr.id)), id: In(apiKeys.map(apk => apk.id)) });
  await repoLcu.delete(users.map(usr => usr.id));
});

// Tests suites
describe('ApiKeyService.create', () => {
  // Tests
  it('should create a new api key', async () => {
    const apiKey = await service.create(users[1].id, { label: 'test' });

    try {
      expect(apiKey).toEqual({
        userId: users[1].id,
        id:     expect.any(String),
        key:    expect.any(String),
        label:  'test'
      });
    } finally {
      const repo = database.getRepository(ApiKey);
      await repo.delete({
        userId: apiKey.userId,
        id: apiKey.id
      });
    }
  });
});
