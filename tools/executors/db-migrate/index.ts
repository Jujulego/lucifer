import { spawnTypeorm } from '../utils';

// Options
interface Options {
  database: string;
}

// Builder
export default async function DbMigrate(options: Options) {
  // Migrate database
  console.info(`Migrating database ${options.database}`);

  try {
    await spawnTypeorm('migration:run', '-c', options.database);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
