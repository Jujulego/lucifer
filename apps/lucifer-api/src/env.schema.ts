import * as joi from 'joi';

// Schema
export const envSchema = joi.object({
  // Basic config
  DATABASE_URL: joi.string(),
  NODE_ENV: joi.string().default('local'),
  PORT: joi.number().port().default(3333),

  // Auth0
  AUTH0_DOMAIN: joi.string().required(),
  AUTH0_AUDIENCE: joi.string().required(),
  AUTH0_CLIENT_ID: joi.string().required(),
  AUTH0_CLIENT_SECRET: joi.string().required(),
});
