import cp from 'child_process';
import path from 'path';

import { logger } from './logger';
import { BuilderContext } from '@angular-devkit/architect';

// Type
export type TypeormCommand = 'migration:run' | 'migration:generate';

// Utils
export async function spawn(cmd: string, args: string[], options: cp.SpawnOptions = {}) {
  // Defaults
  options.shell = options.shell ?? true;
  options.stdio = options.stdio ?? 'inherit';

  // Spawn command
  logger.debug(cmd, args.join(' '));
  const child = cp.spawn(cmd, args, options);

  return new Promise<string[]>((resolve, reject) => {
    const emitted: string[] = [];

    child.stdout?.on('data', (data) => {
      logger.info(data.toString());
      emitted.push(data.toString());
    });

    child.stderr?.on('data', (data) => {
      logger.error(data.toString());
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(emitted);
      } else {
        reject();
      }
    });
  });
}

export async function spawnTypeorm(ctx: BuilderContext, cmd: TypeormCommand, args: string[], options: cp.SpawnOptions = {}) {
  // Setup
  const tsnodeArgs = ['-P', path.join(ctx.workspaceRoot, 'tools/tsconfig.tools.json'), '-r', 'tsconfig-paths/register'];
  const typeormCli = path.join(ctx.workspaceRoot, 'node_modules/typeorm/cli.js');

  return await spawn('ts-node', [...tsnodeArgs, typeormCli, cmd, ...args], {
    ...options,
    shell: true,
    stdio: 'inherit'
  });
}
