import { Connection, ConnectionOptions, ConnectionOptionsReader, getConnectionManager } from 'typeorm';
import path from 'path';
import * as tsnode from 'ts-node';

// Constants
const TSCONFIG_PATH = path.join(__dirname, '../tsconfig.tools.json');

// Utils
export async function getConnectionOptions(projectRoot: string, database = 'default'): Promise<ConnectionOptions> {
  // Read options
  const reader = new ConnectionOptionsReader({ root: projectRoot });
  const config = await reader.get(database);

  // Prefix entities, migrations and subscribers with project root
  Object.assign(config, {
    entities: config.entities?.map(ent => typeof ent === 'string' ? path.join(path.resolve(projectRoot), ent) : ent),
    migrations: config.migrations?.map(mig => typeof mig === 'string' ? path.join(path.resolve(projectRoot), mig) : mig),
    subscribers: config.subscribers?.map(sub => typeof sub === 'string' ? path.join(path.resolve(projectRoot), sub) : sub)
  });

  return config;
}

export async function createConnection(options: ConnectionOptions): Promise<Connection> {
  // Setup tsnode
  tsnode.register({
    project: TSCONFIG_PATH,
    transpileOnly: true
  });

  return await getConnectionManager().create(options).connect();
}
