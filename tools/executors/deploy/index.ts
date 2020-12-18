import { BuilderContext, createBuilder } from '@angular-devkit/architect';
import { json } from '@angular-devkit/core';
import fse from 'fs-extra';
import path from 'path';

import { logger } from '../logger';
import { spawn } from '../utils';

// Options
interface Options extends json.JsonObject {
  buildPath: string;
  repository: string;
}

// Executor
export default createBuilder(async (options: Options, ctx: BuilderContext) => {
  // Setup
  if (!ctx.target) {
    logger.error("Missing target !");
    return { success: false };
  }

  try {
    // Get current project
    const { project } = ctx.target;
    const branch = `heroku/${project}`;
    const tmpDir = path.join(ctx.workspaceRoot, 'tmp', 'heroku');
    const repoDir = path.join(tmpDir, project);
    const buildDir = path.join(ctx.workspaceRoot, options.buildPath);

    // Clone app
    await fse.ensureDir(tmpDir);

    if (await fse.pathExists(repoDir)) {
      await fse.remove(repoDir);
    }

    await spawn('git', ['clone', options.repository, project], { cwd: tmpDir });

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
    await fse.copy(buildDir, repoDir, { overwrite: true, recursive: true });
    await fse.copy(path.join(ctx.workspaceRoot, 'yarn.lock'), path.join(repoDir, 'yarn.lock'), { overwrite: true });

    const pkg = await fse.readJson(path.join(ctx.workspaceRoot, 'package.json'));
    delete pkg.scripts.postinstall;

    await fse.writeFile(path.join(repoDir, 'package.json'), JSON.stringify(pkg, null, 2));

    // Commit
    await spawn('git', ['add', '.'], { cwd: repoDir });
    const rev = await spawn('git', ['rev-parse', '--short', 'HEAD'], { stdio: 'pipe' });
    await spawn('git', ['commit', '-m', `"Deployed ${rev}"`], { cwd: repoDir });
    await spawn('git', ['push', 'origin', branch], { cwd: repoDir });

    // Cleanup
    await fse.remove(repoDir);

    return { success: true };

  } catch (error) {
    console.error(error);
    return { success: false };
  }
});
