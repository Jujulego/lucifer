import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ManagementClient } from 'auth0';
import { Connection } from 'typeorm';

import { IUpdateUser } from '@lucifer/types';
import { DatabaseModule } from '../db/database.module';
import { ManagementClientMock } from '../../mocks/management-client.mock';
import { generateTextContext } from '../../tests/utils';

import { UsersModule } from './users.module';
import { UsersService } from './users.service';
import { LocalUser } from './local-user.entity';
import { RolesService } from './roles.service';

// Load services
let app: TestingModule;
let service: UsersService;
let database: Connection;
let mgmtClient: ManagementClientMock;
let rolesService: RolesService;

beforeAll(async () => {
  app = await Test.createTestingModule({
    imports: [
      DatabaseModule,
      UsersModule,
    ]
  })
    .overrideProvider(ManagementClient).useClass(ManagementClientMock)
    .compile();

  service = app.get(UsersService);
  database = app.get(Connection);
  mgmtClient = app.get(ManagementClient);
  rolesService = app.get(RolesService);
});

afterAll(async () => {
  await app?.close();
});

// Mocks
const users = [
  {
    user_id: 'tests|users-test-1',
    email:   'test-1@test.com',
    name:    'Test 1'
  },
  {
    user_id: 'tests|users-test-2',
    email:   'test-2@test.com',
    name:    'Test 2'
  },
  {
    user_id: 'tests|users-test-3',
    email:   'test-3@test.com',
    name:    'Test 3',
    identities: [
      {
        connection: 'test',
        provider:   'test',
        user_id:    'users-test-3',
        isSocial:   false
      }
    ]
  },
];

let lcu: LocalUser;

beforeEach(async () => {
  jest.resetAllMocks();
  jest.restoreAllMocks();

  // Mocks
  mgmtClient.mockSetUsers(users);

  jest.spyOn(rolesService, 'getUserRoles')
    .mockResolvedValue([]);

  // Database
  const repo = database.getRepository(LocalUser);

  lcu = await repo.save(
    repo.create({ id: 'tests|users-test-1' })
  );
});

afterEach(async () => {
  const repo = database.getRepository(LocalUser);

  await repo.delete(lcu.id);
});

// Tests suites
describe('UsersService.getLocal', () => {
  it('should return existing user', async () => {
    await expect(service.getLocal(lcu.id))
      .resolves.toEqual(lcu);
  });

  it('should create existing user in database', async () => {
    const user = await service.getLocal('tests|users-test-2');

    try {
      expect(user).toEqual({
        id: 'tests|users-test-2'
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
    await expect(service.getLocal('tests|users-test-2'))
      .rejects.toEqual(new NotFoundException('User tests|users-test-2 not found'));
  });
});

describe('UsersService.get', () => {
  beforeEach(() => {
    jest.spyOn(mgmtClient, 'getUser');
  })

  // Tests
  it('should return parsed user', async () => {
    const user = users[0];

    // Call
    await expect(service.get(user.user_id))
      .resolves.toEqual({
        id:        user.user_id,
        email:     user.email,
        name:      user.name,
        roles:     [],
        canUpdate: true
      });

    // Check call
    expect(mgmtClient.getUser).toHaveBeenCalledWith({ id: user.user_id });
  });

  it('should throw if user is undefined', async () => {
    // Call
    await expect(service.get('not-a-user-id'))
      .rejects.toEqual(new NotFoundException(`User not-a-user-id not found`));
  });

  it('should throw if user misses mandatory fields', async () => {
    mgmtClient.mockSetUsers([
      {}
    ]);

    // Call
    await expect(service.get('not-a-user-id'))
      .rejects.toEqual(new NotFoundException(`User not-a-user-id not found`));
  });
});

describe('UsersService.list', () => {
  beforeEach(() => {
    jest.spyOn(mgmtClient, 'getUsers');
  });

  // Tests
  it('should return parsed user list', async () => {
    // Call
    await expect(service.list())
      .resolves.toEqual(
        users.map(usr => expect.objectContaining({ id: usr.user_id }))
      );

    // Check call
    expect(mgmtClient.getUsers).toHaveBeenCalledWith({ sort: 'user_id:1' });
  });

  it('should throw if user misses mandatory fields', async () => {
    mgmtClient.mockSetUsers([{}]);

    // Call
    await expect(service.list())
      .rejects.toEqual(new InternalServerErrorException());
  });
});

describe('UsersService.update', () => {
  const ctx = generateTextContext('test', ['update:users', 'update:roles']);

  beforeEach(() => {
    // Mocks
    jest.spyOn(mgmtClient, 'getUser');
    jest.spyOn(mgmtClient, 'updateUser');

    jest.spyOn(rolesService, 'updateUserRoles')
      .mockImplementation(async (ctx, id, target) => target);
  });

  // Tests
  it('should update user', async () => {
    const user = users[0];
    const update: IUpdateUser = {
      email:   '1-tset@test.com',
      name:    '1 tseT'
    };

    // Call
    await expect(service.update(ctx, user.user_id, update))
      .resolves.toEqual({
        id:        user.user_id,
        email:     update.email,
        name:      update.name,
        roles:     [],
        canUpdate: true
      });

    // Check calls
    expect(mgmtClient.updateUser).toBeCalledWith({ id: user.user_id }, { name: update.name, email: update.email });
    expect(rolesService.updateUserRoles).not.toBeCalled();
  });

  it('should update user roles', async () => {
    const user = users[0];
    const update: IUpdateUser = {
      roles: ['reader'],
    };

    // Call
    await expect(service.update(ctx, user.user_id, update))
      .resolves.toEqual({
        id:        user.user_id,
        email:     user.email,
        name:      user.name,
        roles:     update.roles,
        canUpdate: true
      });

    // Check calls
    expect(mgmtClient.updateUser).not.toBeCalled();
    expect(rolesService.updateUserRoles).toBeCalledWith(ctx, user.user_id, update.roles);
  });

  it('should do nothing', async () => {
    const user = users[0];
    const update: IUpdateUser = {};

    // Call
    await expect(service.update(ctx, user.user_id, update))
      .resolves.toEqual({
        id:        user.user_id,
        email:     user.email,
        name:      user.name,
        roles:     [],
        canUpdate: true
      });

    // Check calls
    expect(mgmtClient.updateUser).not.toBeCalled();
    expect(rolesService.updateUserRoles).not.toBeCalled();
  });

  it('should ignore updates on non auth0 user', async () => {
    const user = users[2];
    const update: IUpdateUser = {
      email: '3-tset@test.com',
      name:  '3 tseT'
    };

    // Call
    await expect(service.update(ctx, user.user_id, update))
      .resolves.toEqual({
        id:        user.user_id,
        email:     user.email,
        name:      user.name,
        roles:     [],
        canUpdate: false
      });

    // Check calls
    expect(mgmtClient.updateUser).not.toBeCalled();
    expect(rolesService.updateUserRoles).not.toBeCalled();
  });

  it('should throw if user is undefined', async () => {
    const user = users[0];
    const update: IUpdateUser = {};

    // Mock
    jest.spyOn(mgmtClient, 'getUser')
      .mockImplementation(async () => undefined);

    // Call
    await expect(service.update(ctx, user.user_id, update))
      .rejects.toEqual(new NotFoundException(`User ${user.user_id} not found`));
  });
});
