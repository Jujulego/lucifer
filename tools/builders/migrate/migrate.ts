import { BuilderContext, createBuilder } from '@angular-devkit/architect';
import { json } from '@angular-devkit/core';
import { createConnection } from 'typeorm';

// Options
interface Options extends json.JsonObject {
  database: string;
}

// Builder
export default createBuilder(async (options: Options, ctx: BuilderContext) => {
  const connection = await createConnection(options.database);

  try {
    ctx.logger.info(`Migrating database ${options.database}`);
    ctx.reportStatus("migrating");

    const migrations = await connection.runMigrations({ transaction: 'each' });

    ctx.reportStatus("done");

    if (migrations.length) {
      ctx.logger.info(`${migrations.length} migrations executed:`);
      migrations.forEach(mig => {
        ctx.logger.info(`- ${mig.name}`);
      });

    } else {
      ctx.logger.info("Nothing to do !");
    }
  } finally {
    await connection.close();
  }

  return { success: true };
});
