import { Logger } from '@nestjs/common';
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

import { IMachine, IProject, IUser } from '@lucifer/types';

import { DatabaseUtils } from '../src/db/utils';
import { LocalUser } from '../src/users/local-user.entity';
import { Machine } from '../src/machines/machine.entity';
import { Project } from '../src/projects/project.entity';

// Types
interface SeedData {
  users?: Pick<IUser, 'id'>[];
  machines?: IMachine[];
  projects?: IProject[];
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
      const repoMch = manager.getRepository(Machine);
      const repoPrj = manager.getRepository(Project);

      // Create users
      const users = await repoLcu.save(data.users?.map(usr => repoLcu.create(usr)) || []);
      Logger.log(`${users.length} users created`);

      // Create machines
      const machines = await repoMch.save(data.machines?.map(mch => repoMch.create(mch)) || []);
      Logger.log(`${machines.length} machines created`);

      // Create users
      const projects = await repoPrj.save(data.projects?.map(prj => repoPrj.create(prj)) || []);
      Logger.log(`${projects.length} projects created`);
    });
  } finally {
    await connection.close();
  }
})();
