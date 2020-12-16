import { spawn } from 'child_process';

import { ExecutorOutput } from './types';

// Type
export type TypeormCommand = 'migration:run' | 'migration:generate';

// Constants
const TSNODE_ARGS = ['-P', 'tools/tsconfig.tools.json', '-r', 'tsconfig-paths/register'];
const TYPEORM_CLI = './node_modules/typeorm/cli.js';

// Utils
export async function spawnTypeorm(cmd: TypeormCommand, ...args: string[]) {
  try {
    const child = spawn('ts-node', [...TSNODE_ARGS, TYPEORM_CLI, cmd, ...args], {
      shell: true,
      stdio: 'inherit'
    });

    return new Promise<ExecutorOutput>((resolve) => {
      child.on('close', (code) => {
        resolve({ success: code === 0 });
      });
    });
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
