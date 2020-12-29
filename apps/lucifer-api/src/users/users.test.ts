import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ManagementClient } from 'auth0';
import { plainToClass } from 'class-transformer';
import { Connection } from 'typeorm';

import { DatabaseModule } from '../database.module';
import { MachinesModule } from '../machines/machines.module';
import { ManagementClientMock } from '../../mocks/management-client.mock';

import { UsersModule } from './users.module';
import { UsersService } from './users.service';
import { UpdateUser } from './user.schema';
import { LocalUser } from './local-user.entity';

// Load services
let app: TestingModule;
let service: UsersService;
let database: Connection;
let mgmtClient: ManagementClientMock;

beforeAll(async () => {
  app = await Test.createTestingModule({
    imports: [
      DatabaseModule,
      MachinesModule,
      UsersModule,
    ]
  })
    .overrideProvider(ManagementClient).useClass(ManagementClientMock)
    .compile();

  service = app.get(UsersService);
  database = app.get(Connection);
  mgmtClient = app.get(ManagementClient);
});

afterAll(async () => {
  await app?.close();
});

// Mocks
afterEach(() => {
  jest.resetAllMocks();
});

// Tests suites
describe('UsersService.getLocal', () => {
  // Test data
  let lcu: LocalUser;

  beforeEach(async () => {
    const repo = database.getRepository(LocalUser);

    lcu = await repo.save(
      repo.create({ id: 'tests|users-01' })
    );
  });

  afterEach(async () => {
    const repo = database.getRepository(LocalUser);

    await repo.delete(lcu.id);
  });

  // Tests
  it('should return existing user', async () => {
    await expect(service.getLocal(lcu.id))
      .resolves.toEqual(lcu);
  });

  it('should create existing user in database', async () => {
    const user = await service.getLocal('tests|users-02');

    try {
      expect(user).toEqual({
        id: 'tests|users-02'
      });
    } finally {
      const repo = database.getRepository(LocalUser);
      await repo.delete(user.id);
    }
  });

  it('should thrown if users does not exist', async () => {
    // Mock
    jest.spyOn(mgmtClient, 'getUser')
      .mockImplementation(async () => undefined);

    // Tests
    await expect(service.getLocal('tests|users-02'))
      .rejects.toEqual(new NotFoundException('User tests|users-02 not found'));
  });
});

describe('UsersService.get', () => {
  const user = {
    user_id:  'tests|users-auth0-11',
    email:    'test11@users.auth0',
    emailVerified: false,
    name:     'Test',
    nickname: 'test',
    picture:  'https://auth0.users.com/test11'
  };

  // Tests
  it('should return parsed user', async () => {
    // Mock
    const spy = jest.spyOn(mgmtClient, 'getUser')
      .mockImplementation(async () => user);

    // Call
    await expect(service.get(user.user_id))
      .resolves.toEqual({
        id:       user.user_id,
        email:    user.email,
        name:     user.name,
        nickname: user.nickname,
        picture:  user.picture,
        machines: []
      });

    // Check call
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ id: user.user_id });
  });

  it('should throw if user is undefined', async () => {
    // Mock
    jest.spyOn(mgmtClient, 'getUser')
      .mockImplementation(async () => undefined);

    // Call
    await expect(service.get(user.user_id))
      .rejects.toEqual(new NotFoundException(`User ${user.user_id} not found`));
  });
});

describe('UsersService.list', () => {
  const users = [
    {
      user_id:  'tests|users-auth0-21',
      email:    'test21@users.auth0',
      emailVerified: false,
      name:     'Test',
      nickname: 'test',
      picture:  'https://auth0.users.com/test21'
    },
    {
      user_id:  'tests|users-auth0-22',
      email:    'test22@users.auth0',
      emailVerified: false,
      name:     'Test',
      nickname: 'test',
      picture:  'https://auth0.users.com/test22'
    }
  ];

  // Tests
  it('should return parsed user list', async () => {
    // Mock
    const spy = jest.spyOn(mgmtClient, 'getUsers')
      .mockImplementation(async () => users);

    // Call
    await expect(service.list())
      .resolves.toEqual(
        users.map(usr => expect.objectContaining({ id: usr.user_id }))
      );

    // Check call
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ sort: 'user_id:1' });
  });
});

describe('UsersService.update', () => {
  const user = {
    user_id:  'tests|users-auth0-31',
    email:    'test31@users.auth0',
    emailVerified: false,
    name:     'Test',
    nickname: 'test',
    picture:  'https://auth0.users.com/test31'
  };

  const update = plainToClass(UpdateUser, {
    name: 'Test #31',
    email: 'test31@gmail.com',
  });

  // Tests
  it('should return updated user', async () => {
    // Mock
    const spy = jest.spyOn(mgmtClient, 'updateUser')
      .mockImplementation(async (params, data) => ({ ...user, ...data }));

    // Call
    await expect(service.update(user.user_id, update))
      .resolves.toEqual({
        id:       user.user_id,
        email:    update.email,
        name:     update.name,
        nickname: user.nickname,
        picture:  user.picture,
        machines: []
      });

    // Check call
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ id: user.user_id }, { name: update.name, email: update.email });
  });

  it('should throw if user is undefined', async () => {
    // Mock
    jest.spyOn(mgmtClient, 'updateUser')
      .mockImplementation(async () => undefined);

    // Call
    await expect(service.update(user.user_id, update))
      .rejects.toEqual(new NotFoundException(`User ${user.user_id} not found`));
  });
});
