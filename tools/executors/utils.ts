import * as cp from 'child_process';

import { logger } from './logger';

// Type
export type TypeormCommand = 'migration:run' | 'migration:generate';

// Constants
const TSNODE_ARGS = ['-P', 'tools/tsconfig.tools.json', '-r', 'tsconfig-paths/register'];
const TYPEORM_CLI = './node_modules/typeorm/cli.js';

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

export async function spawnTypeorm(cmd: TypeormCommand, ...args: string[]) {
  return await spawn('ts-node', [...TSNODE_ARGS, TYPEORM_CLI, cmd, ...args], {
    shell: true,
    stdio: 'inherit'
  });
}
