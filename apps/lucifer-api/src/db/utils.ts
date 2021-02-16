import { Connection, ConnectionOptions, ConnectionOptionsReader, createConnection } from 'typeorm';
import * as path from 'path';

import { env } from '../env';
import { LocalUser } from '../users/local-user.entity';
import { Project } from '../projects/project.entity';
import { Variable } from '../projects/variables/variable.entity';

import { MIGRATIONS } from './migrations';

// Namespace
export const DatabaseUtils = {
  // Utils
  getSourceRoot() {
    let root = path.normalize(__dirname);

    if (root.endsWith(path.join('src', 'db'))) {
      root = path.dirname(path.dirname(root));
    } else {
      root = root.replace(/[\\/]dist/, '');
    }

    return root;
  },
  async readOptions(database: string): Promise<ConnectionOptions> {
    const root = this.getSourceRoot();

    const reader = new ConnectionOptionsReader({ root });
    return await reader.get(database);
  },

  // Options
  async getConnectionOptions(database = 'default'): Promise<ConnectionOptions> {
    if (env.DATABASE_URL) {
      return {
        type: 'postgres',
        url: env.DATABASE_URL,
        migrations: MIGRATIONS,
        entities: [LocalUser, Project, Variable],
        ssl: {
          rejectUnauthorized: false
        }
      };

    } else {
      return {
        ...await this.readOptions(database),
        migrations: MIGRATIONS
      };
    }
  },

  // Connections
  async getConnection(database = 'default'): Promise<Connection> {
    const options = await this.getConnectionOptions(database);
    return await createConnection(options);
  },
};
