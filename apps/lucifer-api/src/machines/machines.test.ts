import { Test, TestingModule } from '@nestjs/testing';
import { Connection } from 'typeorm';

import { DatabaseModule } from '../database.module';
import { UsersService } from '../users/users.service';
import { LocalUser } from '../users/local-user.entity';
import { UsersServiceMock } from '../../mocks/users-service.mock';

import { MachinesModule } from './machines.module';
import { MachinesService } from './machines.service';
import { Machine } from './machine.entity';
import { NotFoundException } from '@nestjs/common';

// Load services
let app: TestingModule;
let service: MachinesService;
let database: Connection;

beforeAll(async () => {
  app = await Test.createTestingModule({
    imports: [
      DatabaseModule,
      MachinesModule
    ]
  })
    .overrideProvider(UsersService).useClass(UsersServiceMock)
    .compile();

  service = app.get(MachinesService);
  database = app.get(Connection);
});

afterAll(async () => {
  await app?.close();
});

// Test data & Mocks
let owners: LocalUser[];
let machines: Machine[];

beforeEach(async () => {
  // Create test entities
  await database.transaction(async manager => {
    const repoLcu = manager.getRepository(LocalUser);
    const repoMch = manager.getRepository(Machine);

    owners = await repoLcu.save([
      repoLcu.create({ id: 'tests|machines-01' }),
      repoLcu.create({ id: 'tests|machines-02' }),
    ]);

    machines = await repoMch.save([
      repoMch.create({ ownerId: owners[0].id, shortName: 'Test #1' }),
      repoMch.create({ ownerId: owners[0].id, shortName: 'Test #2' }),
      repoMch.create({ ownerId: owners[1].id, shortName: 'Test #3' })
    ]);
  });
});

afterEach(async () => {
  jest.resetAllMocks();

  // Remove test entities
  const repoLcu = database.getRepository(LocalUser);
  const repoMch = database.getRepository(Machine);

  await repoMch.delete(machines.map(mch => mch.id));
  await repoLcu.delete(owners.map(own => own.id));
});

// Tests suites
describe('MachinesService.create', function() {
  // Tests
  it('should create a new machine', async () => {
    const machine = await service.create(owners[1].id, { shortName: 'Test #4' });

    try {
      expect(machine).toEqual({
        id:        expect.any(String),
        ownerId:   owners[1].id,
        shortName: 'Test #4',
      });
    } finally {
      const repo = database.getRepository(Machine);
      await repo.delete(machine);
    }
  });
});

describe('MachinesService.get', () => {
  // Tests
  it('should return a machine', async () => {
    const mch = machines[0];

    // Call
    await expect(service.get(owners[0].id, mch.id))
      .resolves.toEqual(mch);
  });

  it('should throw if machine does not exists', async () => {
    // Call
    await expect(service.get(owners[0].id, '12345678-1234-1234-1234-123456789abc'))
      .rejects.toEqual(new NotFoundException('Machine 12345678-1234-1234-1234-123456789abc not found'));
  });
});

describe('MachinesService.list', () => {
  // Tests
  it('should return all owner\'s machines', async () => {
    const own = owners[0];

    // Call
    await expect(service.list(own.id))
      .resolves.toEqual(
        machines.filter(mch => mch.ownerId === own.id)
      );
  });

  // Tests
  it('should empty array for unknown user', async () => {
    // Call
    await expect(service.list('unknown-user'))
      .resolves.toEqual([]);
  });
});
