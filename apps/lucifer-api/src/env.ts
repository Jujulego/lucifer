import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';

import { envSchema } from './env.schema';

// Load config
dotenv.config();

// Validate env
const { error, value } = envSchema.validate(process.env, { allowUnknown: true });

if (error) {
  if (value.NODE_ENV === 'test') {
    console.error(error.message);
  } else {
    const logger = new Logger('Configuration')
    logger.error(error.message);
  }

  process.exit(1);
}

// Environment
export const env = {
  // Basic
  DATABASE_URL: value.DATABASE_URL as string,
  PORT:         value.PORT as number,
  PRODUCTION:   value.NODE_ENV === 'production',
  TESTS:        value.NODE_ENV === 'test',

  // Auth0
  AUTH0_DOMAIN:        value.AUTH0_DOMAIN as string,
  AUTH0_AUDIENCE:      value.AUTH0_AUDIENCE as string,
  AUTH0_CLIENT_ID:     value.AUTH0_CLIENT_ID as string,
  AUTH0_CLIENT_SECRET: value.AUTH0_CLIENT_SECRET as string,
}
