import { BuilderContext, createBuilder } from '@angular-devkit/architect';
import { json } from '@angular-devkit/core';
import simpleGit from 'simple-git';

import { spawn } from '../utils';

// Options
interface Options extends json.JsonObject {
  buildPath: string;
}

// Executor
// https://github.com/s0/git-publish-subdir-action/blob/develop/action/src/index.ts
export default createBuilder(async (options: Options, ctx: BuilderContext) => {
  try {
    // Setup
    const git = simpleGit(ctx.workspaceRoot);

    if (!ctx.target) {
      ctx.logger.error("Missing target !");
      return { success: false };
    }

    // Get current project
    const { project } = ctx.target;
    const remote = `heroku-${project}`;
    const branch = `heroku/${project}`;

    // Create remote
    const hasRemote = (await git.getRemotes()).some(rmt => rmt.name === remote);

    if (!hasRemote) {
      ctx.logger.info(`Creating remote ${remote} ...`);

      if (!await spawn('heroku', ['git:remote', '-a', project, '-r', remote])) {
        ctx.logger.error("Failed to add heroku remote !");
        return { success: false };
      }
    }

    // Fetch branch or create branch
    await spawn('git', ['fetch', '-u', remote, `master:${branch}`]);

    const hasBranch = (await git.branchLocal()).all.includes(branch);
    if (!hasBranch) {
      if (!await spawn('git', ['checkout', '--orphan', branch])) {
        ctx.logger.error("Failed to checkout branch !");
        return { success: false };
      }
    } else {
      if (!await spawn('git', ['checkout', branch])) {
        ctx.logger.error("Failed to checkout branch !");
        return { success: false };
      }
    }

    return { success: true };

  } catch (error) {
    ctx.logger.error(error);
    return { success: false };
  }
});
