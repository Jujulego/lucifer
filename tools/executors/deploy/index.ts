import { BuilderContext, createBuilder } from '@angular-devkit/architect';
import { json } from '@angular-devkit/core';
import simpleGit from 'simple-git';

import { spawn } from '../utils';

// Options
interface Options extends json.JsonObject {
  buildPath: string;
}

// Executor
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

    // Create local branch
    const hasBranch = !!((await git.branchLocal()).branches[branch]);

    if (!hasBranch) {
      ctx.logger.info(`Creating branch ${branch} ...`);

      if (!await spawn('git', ['--work-tree', options.buildPath, 'checkout', '--orphan', branch])) {
        ctx.logger.error("Failed to create branch !");
        return { success: false };
      }

      if (!await spawn('git', ['--work-tree', options.buildPath, 'add', '--all'])) {
        ctx.logger.error("Failed to create branch !");
        return { success: false };
      }
    }

    return { success: true };

  } catch (error) {
    ctx.logger.error(error);
    return { success: false };
  }
});
