import { BuilderContext, createBuilder } from '@angular-devkit/architect';
import { json } from '@angular-devkit/core';
import fse from 'fs-extra';
import path from 'path';
import mkdirp from 'mkdirp';

import { spawn } from '../utils';

// Options
interface Options extends json.JsonObject {
  app: string;
  buildPath: string;
}

// Executor
// https://github.com/s0/git-publish-subdir-action/blob/develop/action/src/index.ts
export default createBuilder(async (options: Options, ctx: BuilderContext) => {
  try {
    // Setup
    if (!ctx.target) {
      ctx.logger.error("Missing target !");
      return { success: false };
    }

    // Get current project
    const { project } = ctx.target;
    const cloneDir = path.join(ctx.workspaceRoot, 'tmp', 'heroku', project);

    // Clone app
    await mkdirp(cloneDir);
    //await spawn('heroku', ['git:clone', '-a', options.app], { cwd: path.dirname(cloneDir) });

    // Copy build scripts
    await fse.copy(options.buildPath, cloneDir, { overwrite: true, recursive: true });
    // TODO: remove postinstall script
    await fse.copy(path.join(ctx.workspaceRoot, 'package.json'), path.join(cloneDir, 'package.json'), { overwrite: true });

    // Commit
    await spawn('git', ['add', '.'], { cwd: cloneDir });
    await spawn('git', ['commit', '-m', 'Deployed'], { cwd: cloneDir });
    await spawn('git', ['push'], { cwd: cloneDir });

    return { success: true };

  } catch (error) {
    ctx.logger.error(error);
    return { success: false };
  }
});
