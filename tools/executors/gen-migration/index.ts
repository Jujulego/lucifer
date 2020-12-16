import { spawnTypeorm } from '../utils';

// Options
interface Options {
  database: string;
  name: string;
}

// Builder
export default async function GenMigration(options: Options) {
  // Migrate database
  try {
    await spawnTypeorm('migration:generate', '-c', options.database, '-n', options.name);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
