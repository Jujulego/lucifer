import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from './env';
import { migrate } from './db/migrate';
import { AppModule } from './app.module';

// Debug
if (!env.PRODUCTION) {
  import('axios-debug-log');
}

// Bootstrap
(async function() {
  const app = await NestFactory.create(AppModule);

  // Commands
  switch (process.argv[2]) {
    case 'migrate':
      return await migrate(app);
  }

  // Setup server
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Middlewares
  app.use(helmet());
  app.use(cors());

  app.use(morgan(env.PRODUCTION ? 'common' : 'dev', {
    stream: {
      write(log: string) {
        Logger.log(log.trimRight());
      }
    }
  }));

  // Start server
  await app.listen(env.PORT, () => {
    Logger.log(`Listening at http://localhost:${env.PORT}/${globalPrefix}`);
  });
})();
