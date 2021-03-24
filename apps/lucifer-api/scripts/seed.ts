import { Logger } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

import { ICreateProject, ICreateVariable, IUser } from '@lucifer/types';

import { DatabaseUtils } from '../src/db/utils';
import { LocalUser } from '../src/users/local-user.entity';
import { Project } from '../src/projects/project.entity';
import { Variable } from '../src/projects/variables/variable.entity';

// Types
type Seed<B, C extends Record<string, unknown>> = (B & {
  [K in keyof C]?: C[K] extends unknown[] ? C[K] : C[K][]
})[];

interface SeedData {
  users: Seed<Pick<IUser, 'id'>, {
    projects: Seed<ICreateProject, {
      variables: ICreateVariable
    }>;
  }>;
}

// Seed
async function seed<E>(name: string, repo: Repository<E>, seeds: DeepPartial<E>[]) {
  const objs = await repo.save(seeds.map(usr => repo.create(usr)));
  Logger.log(`${objs.length} ${name} created`);

  return objs;
}

(async () => {
  const filename = path.join(__dirname, 'seeds', process.argv[2]);

  // Read data file
  const file = await fs.promises.readFile(filename, 'utf-8');
  const data = yaml.parse(file) as SeedData;

  // Connect to database
  Logger.log('Connecting to database ...');
  const connection = await DatabaseUtils.getConnection();
  Logger.log('Connected !');

  try {
    await connection.transaction(async manager => {
      const repoLcu = manager.getRepository(LocalUser);
      const repoPrj = manager.getRepository(Project);
      const repoVrb = manager.getRepository(Variable);

      // Create users
      const { users = [] } = data;
      await seed('users', repoLcu, users);

      // Create projects
      const projects = users.map(({ id: adminId, projects = [] }) => projects.map(prj => ({ ...prj, adminId })))
        .reduce((acc, prjs) => acc.concat(prjs), []);
      await seed('projects', repoPrj, projects);

      // Create variables
      const variables = projects.map(({ id: projectId, adminId, variables = [] }) => variables.map(vrb => ({ ...vrb, adminId, projectId })))
        .reduce((acc, vrbs) => acc.concat(vrbs), []);
      await seed('variables', repoVrb, variables);
    });
  } finally {
    await connection.close();
  }
})();
