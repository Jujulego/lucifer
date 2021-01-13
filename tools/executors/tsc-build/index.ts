import { BuilderContext, createBuilder } from '@angular-devkit/architect';
import { json } from '@angular-devkit/core';
import path from 'path';

import { logger } from '../logger';
import { spawn } from '../utils';

// Options
interface Options extends json.JsonObject {
  tsConfig: string;
}

// Builder
export default createBuilder(async (options: Options, ctx: BuilderContext) => {
  // Setup
  if (!ctx.target) {
    logger.error("Missing target !");
    return { success: false };
  }

  try {
    // Build !
    await spawn('tsc', ['-p', path.join(ctx.workspaceRoot, options.tsConfig)], { cwd: ctx.workspaceRoot });
    return { success: true };
  } catch (error) {
    logger.error(error);
    return { success: false };
  }
});
