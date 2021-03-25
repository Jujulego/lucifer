import { BuilderContext, createBuilder } from '@angular-devkit/architect';
import { json } from '@angular-devkit/core';
import chalk from 'chalk';
import ora from 'ora';
import path from 'path';

import { createConnection, getConnectionOptions } from '../../utils/typeorm';

// Options
interface Options extends json.JsonObject {
  database: string;
}

// Builder
export default createBuilder(async (options: Options, ctx: BuilderContext) => {
  const spinner = ora({
    prefixText: chalk`{grey [${options.database}]}`,
    text: `Migrating database ...`
  }).start();

  // Setup
  if (!ctx.target) {
    spinner.fail('Missing target !');
    return { success: false };
  }

  try {
    // Get project root
    const projectRoot = path.join(
      ctx.workspaceRoot,
      (await ctx.getProjectMetadata(ctx.target)).root as string
    );

    // Read typeorm config
    const config = await getConnectionOptions(projectRoot, options.database);

    // Run migrations
    const connection = await createConnection(config);
    const migrations = await connection.runMigrations({ transaction: 'each' });

    if (migrations.length > 0) {
      spinner.succeed(`${migrations.length} migrations executed:`);
      for (const mig of migrations) {
        spinner.succeed(`- ${mig.name}`);
      }
    } else {
      spinner.info('Nothing to do !');
    }

    return { success: true };
  } catch (error) {
    spinner.fail();
    spinner.fail(`Failed: ${error.message}`);

    return { success: false };
  }
});
