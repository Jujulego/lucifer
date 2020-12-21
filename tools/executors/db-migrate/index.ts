import { BuilderContext, createBuilder } from '@angular-devkit/architect';
import { json } from '@angular-devkit/core';
import path from 'path';

import { logger } from '../logger';
import { spawnTypeorm } from '../utils';

// Options
interface Options extends json.JsonObject {
  database: string;
}

// Builder
export default createBuilder(async (options: Options, ctx: BuilderContext) => {
  // Setup
  if (!ctx.target) {
    logger.error("Missing target !");
    return { success: false };
  }

  try {
    // Get project root
    const projectRoot = path.join(
      ctx.workspaceRoot,
      (await ctx.getProjectMetadata(ctx.target)).root as string
    );

    // Migrate database
    await spawnTypeorm(ctx, 'migration:run', ['-c', options.database], { cwd: projectRoot });
    return { success: true };
  } catch (error) {
    logger.error(error);
    return { success: false };
  }
});
