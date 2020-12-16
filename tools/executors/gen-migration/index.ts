import { json } from '@angular-devkit/core';

import { spawnTypeorm } from '../typeorm';

// Options
interface Options extends json.JsonObject {
  database: string;
  name: string;
}

// Builder
export default async function(options: Options) {
  // Migrate database
  return await spawnTypeorm('migration:generate', '-c', options.database, '-n', options.name);
}
