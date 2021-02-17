import { Logger } from '@nestjs/common';
import { Asserts } from 'yup';
import * as dotenv from 'dotenv';

import { envSchema } from './env.schema';

// Load config
dotenv.config();

// Validate env
let value: Asserts<typeof envSchema>;

try {
  value = envSchema.validateSync(process.env);
} catch (error) {
  if (process.env.NODE_ENV === 'test') {
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
  DATABASE_URL: value.DATABASE_URL,
  PORT:         value.PORT,
  PRODUCTION:   value.NODE_ENV === 'production',
  TESTS:        value.NODE_ENV === 'test',

  // Auth0
  AUTH0_DOMAIN:        value.AUTH0_DOMAIN,
  AUTH0_AUDIENCE:      value.AUTH0_AUDIENCE,
  AUTH0_CLIENT_ID:     value.AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET: value.AUTH0_CLIENT_SECRET,
}
