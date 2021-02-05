import { Logger } from '@nestjs/common';
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

import { IProject, IUser, IVariable } from '@lucifer/types';

import { DatabaseUtils } from '../src/db/utils';
import { LocalUser } from '../src/users/local-user.entity';
import { Project } from '../src/projects/project.entity';
import { Variable } from '../src/projects/variables/variable.entity';

// Types
interface SeedData {
  users?: Pick<IUser, 'id'>[];
  projects?: IProject[];
  variables?: IVariable[];
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
      const users = await repoLcu.save(data.users?.map(usr => repoLcu.create(usr)) || []);
      Logger.log(`${users.length} users created`);

      // Create projects
      const projects = await repoPrj.save(data.projects?.map(prj => repoPrj.create(prj)) || []);
      Logger.log(`${projects.length} projects created`);

      // Create variables
      const variables = await repoVrb.save(data.variables?.map(vrb => repoVrb.create(vrb)) || []);
      Logger.log(`${variables.length} variables created`);
    });
  } finally {
    await connection.close();
  }
})();
