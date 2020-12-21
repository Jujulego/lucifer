import { INestApplication, Logger } from '@nestjs/common';
import { Connection } from 'typeorm';

// Utils
export async function migrate(app: INestApplication) {
  const logger = new Logger(migrate.name);
  const connection = app.get(Connection);

  try {
    // Start migration
    const applied = await connection.runMigrations({ transaction: 'all' });

    logger.log(`${applied.length} migrations applied${applied.length > 0 ? ':' : ''}`);
    for (const migration of applied) {
      logger.log(`- ${migration.name}`);
    }

    process.exit(0);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}
