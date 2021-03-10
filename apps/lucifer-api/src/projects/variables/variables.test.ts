import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection, In } from 'typeorm';

import { ICreateVariable, IUpdateVariable } from '@lucifer/types';
import { DatabaseModule } from '../../db/database.module';
import { UsersService } from '../../users/users.service';
import { LocalUser } from '../../users/local-user.entity';
import { Project } from '../project.entity';

import { UsersServiceMock } from '../../../mocks/users-service.mock';

import { VariablesModule } from './variables.module';
import { VariablesService } from './variables.service';
import { Variable } from './variable.entity';

// Load services
let app: TestingModule;
let service: VariablesService;
let database: Connection;

beforeAll(async () => {
  app = await Test.createTestingModule({
    imports: [
      DatabaseModule,
      VariablesModule,
    ]
  })
    .overrideProvider(UsersService).useClass(UsersServiceMock)
    .compile();

  service = app.get(VariablesService);
  database = app.get(Connection);
});

afterAll(async () => {
  await app?.close();
});

// Test data & Mocks
let admin: LocalUser;
let projects: Project[];
let variables: Variable[];

beforeEach(async () => {
  jest.resetAllMocks();

  // Create test entities
  await database.transaction(async manager => {
    const repoLcu = manager.getRepository(LocalUser);
    const repoPrj = manager.getRepository(Project);
    const repoVrb = manager.getRepository(Variable);

    admin = await repoLcu.save(
      repoLcu.create({ id: 'tests|variables-01' })
    );

    projects = await repoPrj.save([
      repoPrj.create({ adminId: admin.id, id: 'test-1', name: 'Test #1' }),
      repoPrj.create({ adminId: admin.id, id: 'test-2', name: 'Test #2' }),
    ]);

    variables = await repoVrb.save([
      repoVrb.create({ adminId: admin.id, projectId: projects[0].id, id: 'test-1', name: 'TEST1', value: '1' }),
      repoVrb.create({ adminId: admin.id, projectId: projects[0].id, id: 'test-2', name: 'TEST2', value: '2' }),
      repoVrb.create({ adminId: admin.id, projectId: projects[1].id, id: 'test-1', name: 'TEST1', value: '1' }),
    ]);
  });
});

afterEach(async () => {
  // Remove test entities
  const repoLcu = database.getRepository(LocalUser);
  const repoPrj = database.getRepository(Project);
  const repoVrb = database.getRepository(Variable);

  await repoVrb.delete({ adminId: admin.id, id: In(variables.map(vrb => vrb.id)) });
  await repoPrj.delete({ adminId: admin.id, id: In(projects.map(obj => obj.id)) });
  await repoLcu.delete(admin.id);
});

// Tests
describe('VariablesService.create', () => {
  // Tests
  it('should create a new variable', async () => {
    const data: ICreateVariable = {
      id:    'test-2',
      name:  'TEST2',
      value: '2'
    };

    const vrb = await service.create(projects[1].id, data);

    try {
      expect(vrb).toEqual({
        adminId:   admin.id,
        projectId: projects[1].id,
        id:        data.id,
        name:      data.name,
        value:     data.value
      });
    } finally {
      const repo = database.getRepository(Variable);
      await repo.delete({ adminId: vrb.adminId, projectId: vrb.projectId, id: vrb.id });
    }
  });

  it('should throw as "new" variable already exists', async () => {
    const data: ICreateVariable = {
      id:    'test-1',
      name:  'TEST1',
      value: '1'
    };

    await expect(service.create('this-project-does-not-exists', data))
      .rejects.toEqual(new NotFoundException('Project this-project-does-not-exists not found'));
  });

  it('should throw as project does not exists', async () => {
    const data: ICreateVariable = {
      id:    'test-1',
      name:  'TEST1',
      value: '1'
    };

    await expect(service.create(projects[1].id, data))
      .rejects.toEqual(new ConflictException(`Variable with id ${data.id} already exists.`));
  });
});

describe('VariablesService.list', () => {
  // Tests
  it('should list all project\'s variables', async () => {
    const prj = projects[0];

    // Call
    await expect(service.list(prj.id))
      .resolves.toEqual(
        variables.filter(vrb => vrb.projectId === prj.id)
      );
  });

  it('should empty array for unknown user', async () => {
    const prj = projects[0];

    // Call
    await expect(service.list(prj.id))
      .resolves.toEqual([]);
  });

  it('should empty array for unknown project', async () => {
    // Call
    await expect(service.list('unknown-project'))
      .resolves.toEqual([]);
  });
});

describe('VariablesService.get', () => {
  // Tests
  it('should return a variable', async () => {
    const vrb = variables[0];

    // Call
    await expect(service.get(vrb.projectId, vrb.id))
      .resolves.toEqual(vrb);
  });

  it('should throw if variable does not exists', async () => {
    const vrb = variables[0];

    // Call
    await expect(service.get(vrb.projectId, 'this-variable-does-not-exists'))
      .rejects.toEqual(new NotFoundException('Variable this-variable-does-not-exists not found'));
  });

  it('should throw if wrong project', async () => {
    const vrb = variables[0];

    // Call
    await expect(service.get('wrong-project-id', vrb.id))
      .rejects.toEqual(new NotFoundException(`Variable ${vrb.id} not found`));
  });

  it('should throw if wrong admin', async () => {
    const vrb = variables[0];

    // Call
    await expect(service.get(vrb.projectId, vrb.id))
      .rejects.toEqual(new NotFoundException(`Variable ${vrb.id} not found`));
  });
});

describe('VariablesService.update', () => {
  const update: IUpdateVariable = {
    name: 'updated',
    value: 'updated'
  };

  // Tests
  it('should update a variable', async () => {
    const vrb = variables[0];

    // Call
    await expect(service.update(vrb.projectId, vrb.id, update))
      .resolves.toEqual({
        adminId:   vrb.adminId,
        projectId: vrb.projectId,
        id:        vrb.id,
        name:      update.name,
        value:     update.value
      });
  });

  it('should throw if variable does not exists', async () => {
    const vrb = variables[0];

    // Call
    await expect(service.update(vrb.projectId, 'this-variable-does-not-exists', update))
      .rejects.toEqual(new NotFoundException('Variable this-variable-does-not-exists not found'));
  });

  it('should throw if wrong project', async () => {
    const vrb = variables[0];

    // Call
    await expect(service.update('wrong-project-id', vrb.id, update))
      .rejects.toEqual(new NotFoundException(`Variable ${vrb.id} not found`));
  });

  it('should throw if wrong admin', async () => {
    const vrb = variables[0];

    // Call
    await expect(service.update(vrb.projectId, vrb.id, update))
      .rejects.toEqual(new NotFoundException(`Variable ${vrb.id} not found`));
  });
});

describe('VariablesService.delete', () => {
  // Tests
  it('should delete given variable', async () => {
    const vrb = variables[0];

    await expect(service.delete(vrb.projectId, [vrb.id]))
      .resolves.toBe(1);
  });
});
