import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ManagementClient } from 'auth0';

import { ManagementClientMock } from 'mocks/management-client.mock';

import { UsersModule } from './users.module';
import { UsersService } from './users.service';

// Load services
let app: TestingModule;
let service: UsersService;
let mgmtClient: ManagementClientMock;

beforeAll(async () => {
  app = await Test.createTestingModule({
    imports: [UsersModule]
  })
    .overrideProvider(ManagementClient).useClass(ManagementClientMock)
    .compile();

  service = app.get(UsersService);
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
describe('UsersService.get', () => {
  const user = {
    user_id:  'tests|users-auth0-10',
    email:    'test10@users.auth0',
    emailVerified: false,
    name:     'Test',
    nickname: 'test',
    picture:  'https://auth0.users.com/test10'
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
        picture:  user.picture
      });

    // Check call
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ id: user.user_id });
  });

  it('should throw if user is undefined', async () => {
    // Mock
    jest.spyOn(mgmtClient, 'getUser')
      .mockImplementation(async () => null);

    // Call
    await expect(service.get(user.user_id))
      .rejects.toEqual(new NotFoundException(`User ${user.user_id} not found`));
  });
})

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

  it('should throw if auth0 throws', async () => {
    // Mock
    const error = new Error();

    jest.spyOn(mgmtClient, 'getUsers')
      .mockImplementation(async () => { throw error; });

    // Call
    await expect(service.list())
      .rejects.toBe(error);
  });
});
