import { Connection, ConnectionOptions, ConnectionOptionsReader, createConnection } from 'typeorm';
import * as path from 'path';

import { MIGRATIONS } from './migrations';
import { env } from '../env';

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
        migrations: MIGRATIONS
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
