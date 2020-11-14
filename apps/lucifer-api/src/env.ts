import { Logger } from '@nestjs/common';
import dotenv from 'dotenv';

import { envSchema } from 'env.schema';

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
  PORT:       value.PORT as number,
  PRODUCTION: value.NODE_ENV === 'production',
  TESTS:      value.NODE_ENV === 'test',
}
