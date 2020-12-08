import { createBuilder } from '@angular-devkit/architect';
import { json } from '@angular-devkit/core';

// Options
interface Options extends json.JsonObject {
  database: string;
}

// Builder
export default createBuilder(async (options: Options, ctx) => {
  ctx.logger.info(`Migrating database ${options.database}`);

  return { success: true };
});
