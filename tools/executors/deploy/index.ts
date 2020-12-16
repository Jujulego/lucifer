import { BuilderContext, createBuilder } from '@angular-devkit/architect';
import { json } from '@angular-devkit/core';
import simpleGit from 'simple-git';

// Executor
export default createBuilder(async (options: json.JsonObject, ctx: BuilderContext) => {
  // Setup
  const git = simpleGit(ctx.workspaceRoot);

  if (!ctx.target) {
    ctx.logger.error("Missing target !");
    return { success: false };
  }

  // Get current project
  const { project } = ctx.target;
  const remote = `heroku-${project}`;

  // Check remotes
  const hasRemote = (await git.getRemotes()).some(rmt => rmt.name === remote);
  ctx.logger.info(hasRemote ? 'remote :D' : 'no remote :(');

  return { success: true };
});
