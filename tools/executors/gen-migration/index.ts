import { spawnTypeorm } from '../typeorm';

// Options
interface Options {
  database: string;
  name: string;
}

// Builder
export default async function GenMigration(options: Options) {
  // Migrate database
  return await spawnTypeorm('migration:generate', '-c', options.database, '-n', options.name);
}
