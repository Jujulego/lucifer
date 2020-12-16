import { BuilderContext, createBuilder } from '@angular-devkit/architect';
import { json } from '@angular-devkit/core';
import fse from 'fs-extra';
import path from 'path';

import { spawn } from '../utils';

// Options
interface Options extends json.JsonObject {
  app: string;
  buildPath: string;
}

// Executor
export default createBuilder(async (options: Options, ctx: BuilderContext) => {
  try {
    // Setup
    if (!ctx.target) {
      ctx.logger.error("Missing target !");
      return { success: false };
    }

    // Get current project
    const { project } = ctx.target;
    const tmpDir = path.join(ctx.workspaceRoot, 'tmp', 'heroku');
    const repoDir = path.join(tmpDir, project);

    // Clone app
    await fse.ensureDir(tmpDir);

    if (!await fse.pathExists(repoDir)) {
      await spawn('heroku', ['git:clone', '-a', options.app], { cwd: path.dirname(repoDir) });
    } else {
      try {
        await spawn('git', ['pull'], { cwd: repoDir });
      } catch (err) {}
    }

    // Copy build scripts
    await fse.copy(options.buildPath, repoDir, { overwrite: true, recursive: true });
    // TODO: remove postinstall script
    await fse.copy(path.join(ctx.workspaceRoot, 'package.json'), path.join(repoDir, 'package.json'), { overwrite: true });
    await fse.copy(path.join(ctx.workspaceRoot, 'yarn.lock'), path.join(repoDir, 'yarn.lock'), { overwrite: true });

    // Commit
    await spawn('git', ['add', '.'], { cwd: repoDir });
    await spawn('git', ['commit', '-m', 'Deployed'], { cwd: repoDir });
    await spawn('git', ['push'], { cwd: repoDir });

    return { success: true };

  } catch (error) {
    ctx.logger.error(error);
    return { success: false };
  }
});
