import { BuilderContext, createBuilder } from '@angular-devkit/architect';
import { json } from '@angular-devkit/core';

import { spawnTypeorm } from '../typeorm';

// Options
interface Options extends json.JsonObject {
  database: string;
}

// Builder
export default createBuilder(async (options: Options, ctx: BuilderContext) => {
  // Migrate database
  ctx.reportStatus('migrating')
  ctx.logger.info(`Migrating database ${options.database}`);

  return await spawnTypeorm(ctx, 'migration:run', '-c', options.database);
});
