import { Logger } from '@nestjs/common';
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
      Logger.log(`${(await repoLcu.save(users.map(usr => repoLcu.create(usr)))).length} users created`);

      for (const { id: adminId, projects = [] } of users) {
        Logger.log(`${(await repoLcu.save(projects.map(prj => repoPrj.create({ adminId, ...prj })))).length} projects created`);

        for (const { id: projectId, variables = [] } of projects) {
          Logger.log(`${(await repoVrb.save(variables.map(vrb => repoVrb.create({ adminId, projectId, ...vrb })))).length} variables created`);
        }
      }
    });
  } finally {
    await connection.close();
  }
})();
