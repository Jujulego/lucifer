import { BuilderContext, createBuilder } from '@angular-devkit/architect';
import { json } from '@angular-devkit/core';

import { spawnTypeorm } from '../typeorm';

// Options
interface Options extends json.JsonObject {
  database: string;
  name: string;
}

// Builder
export default createBuilder(async (options: Options, ctx: BuilderContext) => {
  // Migrate database
  ctx.reportStatus('generating');
  return await spawnTypeorm(ctx, 'migration:generate', '-c', options.database, '-n', options.name);
});
