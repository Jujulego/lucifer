import { logger } from '../logger';
import { spawnTypeorm } from '../utils';

// Options
interface Options {
  database: string;
}

// Builder
export default async function DbMigrate(options: Options) {
  // Migrate database
  logger.info(`Migrating database ${options.database}`);

  try {
    await spawnTypeorm('migration:run', '-c', options.database);
    return { success: true };
  } catch (error) {
    logger.error(error);
    return { success: false };
  }
}
