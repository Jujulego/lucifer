import { BuilderContext, createBuilder } from '@angular-devkit/architect';
import { json } from '@angular-devkit/core';
import chalk from 'chalk';
import ora from 'ora';
import path from 'path';

import { createConnection, getConnectionOptions, OraLogger } from '../../utils/typeorm';

// Types
interface PGDatabase {
  datname: string;
}

interface Options extends json.JsonObject {
  database: string;
}

// Builder
export default createBuilder(async (options: Options, ctx: BuilderContext) => {
  const spinner = ora({
    prefixText: chalk`{grey [${options.database}]}`,
    text: `Creating database ...`
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

    if (config.type !== 'postgres') {
      spinner.fail(`Unsupported database type ${config.type}`);
      return { success: false };
    }

    // Connect to database
    const connection = await createConnection({
      ...config,
      database: 'postgres',
      logger: new OraLogger(spinner, config.logging)
    });

    // Create database if missing
    const [{ count }] = await connection.query(`select count(distinct datname) as count from pg_database where datname=$1`, [config.database]);

    if (count === '0') {
      await connection.query(`create database ${config.database}`);
      spinner.succeed(`Database ${config.database} created`);
    } else {
      spinner.info(`Database ${config.database} already exists`);
    }

    return { success: true };
  } catch (error) {
    spinner.fail();
    spinner.fail(`Failed: ${error.message}`);

    return { success: false };
  }
});
