import { createBuilder } from '@angular-devkit/architect';

// Builder
export default createBuilder((_, ctx) => {
  ctx.logger.info('Migrating project');
  ctx.logger.info(`currently at ${process.cwd()}`);

  return { success: true };
});
