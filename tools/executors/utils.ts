import * as cp from 'child_process';

// Type
export type TypeormCommand = 'migration:run' | 'migration:generate';

// Constants
const TSNODE_ARGS = ['-P', 'tools/tsconfig.tools.json', '-r', 'tsconfig-paths/register'];
const TYPEORM_CLI = './node_modules/typeorm/cli.js';

// Utils
export async function spawn(cmd: string, args: string[], options: cp.SpawnOptions = {}): Promise<boolean> {
  // Defaults
  options.shell = options.shell ?? true;
  options.stdio = options.stdio ?? 'inherit';

  // Spawn command
  try {
    console.debug(cmd, args, options);
    const child = cp.spawn(cmd, args, options);

    return new Promise<boolean>((resolve, reject) => {
      child.stdout?.on('data', (data) => {
        console.info(data);
      });

      child.stderr?.on('data', (data) => {
        console.error(data);
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve(true);
        } else {
          reject();
        }
      });
    });
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function spawnTypeorm(cmd: TypeormCommand, ...args: string[]) {
  const success = await spawn('ts-node', [...TSNODE_ARGS, TYPEORM_CLI, cmd, ...args], {
    shell: true,
    stdio: 'inherit'
  });
  return { success };
}
