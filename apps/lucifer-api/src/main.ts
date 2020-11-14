import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from 'env';
import { AppModule } from 'app/app.module';

// Bootstrap
(async function() {
  const app = await NestFactory.create(AppModule);

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
