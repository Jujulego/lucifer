import { BuilderContext, createBuilder } from '@angular-devkit/architect';
import { json } from '@angular-devkit/core';
import { ConnectionOptionsReader, createConnection } from 'typeorm';
import path from 'path';
import * as tsnode from 'ts-node';

import { logger } from '../logger';

// Constants
const TSCONFIG_PATH = path.join(__dirname, '../../tsconfig.tools.json');

// Options
interface Options extends json.JsonObject {
  database: string;
}

// Builder
export default createBuilder(async (options: Options, ctx: BuilderContext) => {
  // Setup
  if (!ctx.target) {
    logger.error("Missing target !");
    return { success: false };
  }

  try {
    // Get project root
    const projectRoot = path.join(
      ctx.workspaceRoot,
      (await ctx.getProjectMetadata(ctx.target)).root as string
    );

    // Read typeorm config
    const reader = new ConnectionOptionsReader({ root: projectRoot });
    const config = await reader.get(options.database);

    // Prefix entities, migrations & subscribers paths
    Object.assign(config, {
      entities: config.entities?.map(ent => typeof ent === 'string' ? path.join(path.resolve(projectRoot), ent) : ent),
      migrations: config.migrations?.map(mig => typeof mig === 'string' ? path.join(path.resolve(projectRoot), mig) : mig),
      subscribers: config.subscribers?.map(sub => typeof sub === 'string' ? path.join(path.resolve(projectRoot), sub) : sub)
    });

    // Setup tsnode
    tsnode.register({
      project: TSCONFIG_PATH,
      transpileOnly: true
    });

    // Connect to database
    logger.log(`Migrating database ${options.database} ...`);
    const connection = await createConnection(config);
    const migrations = await connection.runMigrations({ transaction: 'each' });

    if (migrations.length > 0) {
      logger.log(`${migrations.length} migrations executed:`);
      for (const mig of migrations) {
        logger.log(`- ${mig.name}`);
      }
    } else {
      logger.log('Nothing to do !');
    }

    return { success: true };
  } catch (error) {
    logger.error(error);
    return { success: false };
  }
});
