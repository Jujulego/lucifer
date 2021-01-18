import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { ManagementClient } from 'auth0';

import { DatabaseModule } from '../database.module';
import { ManagementClientMock } from '../../mocks/management-client.mock';
import { generateTextContext } from '../../tests/utils';

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
      .mockImplementation(async () => [{ name: 'test', id: 'role-1' }]);

    await expect(service.getUserRoles('test'))
      .resolves.toEqual(['test']);
  });
});

describe('RolesService.updateUserRoles', () => {
  const ctx = generateTextContext('test', ['update:roles']);

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
      .resolves.toBeUndefined();

    expect(spyA).toHaveBeenCalledWith({ id: 'test' }, { roles: ['admin-id'] });
    expect(spyR).not.toBeCalled();
  });

  it('should remove one role', async () => {
    const spyA = jest.spyOn(mgmtClient, 'assignRolestoUser');
    const spyR = jest.spyOn(mgmtClient, 'removeRolesFromUser');

    await expect(service.updateUserRoles(ctx, 'test', []))
      .resolves.toBeUndefined();

    expect(spyA).not.toBeCalled();
    expect(spyR).toHaveBeenCalledWith({ id: 'test' }, { roles: ['reader-id'] });
  });

  it('should do nothing', async () => {
    const spyA = jest.spyOn(mgmtClient, 'assignRolestoUser');
    const spyR = jest.spyOn(mgmtClient, 'removeRolesFromUser');

    await expect(service.updateUserRoles(ctx, 'test', ['reader']))
      .resolves.toBeUndefined();

    expect(spyA).not.toBeCalled();
    expect(spyR).not.toBeCalled();
  });

  it('should throw forbidden', async () => {
    const ctx = generateTextContext('test', ['update:roles']);

    const spyA = jest.spyOn(mgmtClient, 'assignRolestoUser');
    const spyR = jest.spyOn(mgmtClient, 'removeRolesFromUser');

    await expect(service.updateUserRoles(ctx, 'test', ['admin']))
      .rejects.toEqual(new ForbiddenException());

    expect(spyA).not.toBeCalled();
    expect(spyR).not.toBeCalled();
  });
});
