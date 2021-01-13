import { BuilderContext, createBuilder } from '@angular-devkit/architect';
import { json } from '@angular-devkit/core';
import path from 'path';

import { logger } from '../logger';
import { spawn } from '../utils';

// Options
interface Options extends json.JsonObject {
  tsConfig: string;
  watch: boolean;
}

// Builder
export default createBuilder(async (options: Options, ctx: BuilderContext) => {
  // Setup
  if (!ctx.target) {
    logger.error("Missing target !");
    return { success: false };
  }

  try {
    // Parse options
    const args = ['-p', path.join(ctx.workspaceRoot, options.tsConfig)];

    if (options.watch) {
      args.push('--watch')
    }

    // Build !
    await spawn('tsc', args, { cwd: ctx.workspaceRoot });
    return { success: true };
  } catch (error) {
    logger.error(error);
    return { success: false };
  }
});
