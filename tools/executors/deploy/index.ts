import { BuilderContext, createBuilder } from '@angular-devkit/architect';
import { json } from '@angular-devkit/core';
import fse from 'fs-extra';
import path from 'path';

import { spawn } from '../utils';

// Options
interface Options extends json.JsonObject {
  buildPath: string;
  herokuRepo: string;
}

// Executor
export default createBuilder(async (options: Options, ctx: BuilderContext) => {
  try {
    // Setup
    if (!ctx.target) {
      console.error("Missing target !");
      return { success: false };
    }

    // Get current project
    const { project } = ctx.target;
    const branch = `heroku/${project}`;
    const tmpDir = path.join(ctx.workspaceRoot, 'tmp', 'heroku');
    const repoDir = path.join(tmpDir, project);

    // Clone app
    await fse.ensureDir(tmpDir);

    if (await fse.pathExists(repoDir)) {
      await fse.remove(repoDir);
    }

    await spawn('git', ['clone', options.herokuRepo, project], { cwd: tmpDir });

    // Checkout and pull
    const branches = await spawn('git', ['branch', '--list', '-a', `origin/${branch}`], { cwd: repoDir, stdio: 'pipe' });

    if (branches.length === 0) {
      await spawn('git', ['checkout', '--orphan', branch], { cwd: repoDir });
      await spawn('git', ['reset', '--hard'], { cwd: repoDir });
    } else {
      await spawn('git', ['checkout', '-t', `origin/${branch}`], { cwd: repoDir });
      await spawn('git', ['pull', '--ff-only'], { cwd: repoDir });
    }

    // Copy build scripts
    await fse.copy(options.buildPath, repoDir, { overwrite: true, recursive: true });
    // TODO: remove postinstall script
    await fse.copy(path.join(ctx.workspaceRoot, 'package.json'), path.join(repoDir, 'package.json'), { overwrite: true });
    await fse.copy(path.join(ctx.workspaceRoot, 'yarn.lock'), path.join(repoDir, 'yarn.lock'), { overwrite: true });

    // Commit
    await spawn('git', ['add', '.'], { cwd: repoDir });
    await spawn('git', ['commit', '-m', 'Deployed'], { cwd: repoDir });
    await spawn('git', ['push', '--set-upstream', 'origin', branch], { cwd: repoDir });

    return { success: true };

  } catch (error) {
    console.error(error);
    return { success: false };
  }
});
