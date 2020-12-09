import { BuilderContext, BuilderOutput, createBuilder } from '@angular-devkit/architect';
import { json } from '@angular-devkit/core';
import { spawn } from 'child_process';
import * as path from 'path';
import { Observable } from 'rxjs';

// Options
interface Options extends json.JsonObject {
  database: string;
}

// Builder
export default createBuilder(async (options: Options, ctx: BuilderContext) => {
  // Get project root
  const mtd = await ctx.getProjectMetadata(ctx.target!);
  const tsConfig = path.join(mtd.root as string, 'tsconfig.json');

  // Migrate database
  ctx.logger.info(`Migrating database ${options.database}`);
  ctx.logger.info(`ts-node -P ${tsConfig} -r tsconfig-paths/register ./node_modules/typeorm/cli.js migrate`);

  try {
    const child = spawn('ts-node', ['-P', tsConfig, '-r', 'tsconfig-paths/register', './node_modules/typeorm/cli.js', 'migration:run'], { shell: true });

    return new Promise<BuilderOutput>((resolve) => {
      child.stdout.on('data', (data) => {
        ctx.logger.info(data.toString());
      });
      child.stderr.on('data', (data) => {
        ctx.logger.error(data.toString());
      });
      child.on('close', (code) => {
        ctx.logger.info(`Done.`);
        resolve({ success: code === 0 });
      });
    });
  } catch (error) {
    ctx.logger.error(error);
    return { success: false };
  }
});
