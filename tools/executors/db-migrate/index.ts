import { spawnTypeorm } from '../typeorm';

// Options
interface Options {
  database: string;
}

// Builder
export default async function DbMigrate(options: Options) {
  // Migrate database
  console.info(`Migrating database ${options.database}`);

  return await spawnTypeorm('migration:run', '-c', options.database);
}
