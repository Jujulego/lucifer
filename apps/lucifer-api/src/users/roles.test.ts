import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { ManagementClient } from 'auth0';

import { DatabaseModule } from '../db/database.module';
import { ManagementClientMock } from '../../mocks/management-client.mock';
import { generateTestContext } from '../../tests/utils';

import { UsersModule } from './users.module';
import { RolesService } from './roles.service';

// Load services
let app: TestingModule;
let service: RolesService;
let mgmtClient: ManagementClientMock;

beforeAll(async () => {
  app = await Test.createTestingModule({
    imports: [
      DatabaseModule,
      UsersModule
    ]
  })
    .overrideProvider(ManagementClient).useClass(ManagementClientMock)
    .compile();

  service = app.get(RolesService);
  mgmtClient = app.get(ManagementClient);
});

afterAll(async () => {
  await app?.close();
});

// Mocks
beforeEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

// Tests suites
describe('RolesService.getUserRoles', () => {
  it('should return no roles', async () => {
    // Default mock implementation returns empty array
    const spy = jest.spyOn(mgmtClient, 'getUserRoles');

    await expect(service.getUserRoles('test'))
      .resolves.toEqual([]);

    expect(spy).toHaveBeenCalledWith({ id: 'test' });
  });

  it('should return user\'s roles', async () => {
    jest.spyOn(mgmtClient, 'getUserRoles')
      .mockImplementation(async () => [{ name: 'test', id: 'role-test' }]);

    await expect(service.getUserRoles('test'))
      .resolves.toEqual(['test']);
  });
});

describe('RolesService.updateUserRoles', () => {
  const ctx = generateTestContext('test', ['update:roles']);

  beforeEach(() => {
    jest.spyOn(mgmtClient, 'getRoles')
      .mockImplementation(async () => [
        { name: 'reader', id: 'reader-id' },
        { name: 'admin',  id: 'admin-id' }
      ]);

    jest.spyOn(mgmtClient, 'getUserRoles')
      .mockImplementation(async () => [{ name: 'reader', id: 'role-reader' }]);
  });

  // Tests
  it('should assign one role', async () => {
    const spyA = jest.spyOn(mgmtClient, 'assignRolestoUser');
    const spyR = jest.spyOn(mgmtClient, 'removeRolesFromUser');

    await expect(service.updateUserRoles(ctx, 'test', ['reader', 'admin']))
      .resolves.toEqual(['reader', 'admin']);

    expect(spyA).toHaveBeenCalledWith({ id: 'test' }, { roles: ['admin-id'] });
    expect(spyR).not.toBeCalled();
  });

  it('should remove one role', async () => {
    const spyA = jest.spyOn(mgmtClient, 'assignRolestoUser');
    const spyR = jest.spyOn(mgmtClient, 'removeRolesFromUser');

    await expect(service.updateUserRoles(ctx, 'test', []))
      .resolves.toEqual([]);

    expect(spyA).not.toBeCalled();
    expect(spyR).toHaveBeenCalledWith({ id: 'test' }, { roles: ['reader-id'] });
  });

  it('should do nothing', async () => {
    const spyA = jest.spyOn(mgmtClient, 'assignRolestoUser');
    const spyR = jest.spyOn(mgmtClient, 'removeRolesFromUser');

    await expect(service.updateUserRoles(ctx, 'test', ['reader']))
      .resolves.toEqual(['reader']);

    expect(spyA).not.toBeCalled();
    expect(spyR).not.toBeCalled();
  });

  it('should throw forbidden', async () => {
    const ctx = generateTestContext('test', []);

    const spyA = jest.spyOn(mgmtClient, 'assignRolestoUser');
    const spyR = jest.spyOn(mgmtClient, 'removeRolesFromUser');

    await expect(service.updateUserRoles(ctx, 'test', ['admin']))
      .rejects.toEqual(new ForbiddenException());

    expect(spyA).not.toBeCalled();
    expect(spyR).not.toBeCalled();
  });
});
