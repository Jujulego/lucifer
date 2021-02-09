import { number, object, string } from 'yup';

// Schema
export const envSchema = object({
  // Basic config
  DATABASE_URL: string(),
  NODE_ENV: string().default('local'),
  PORT: number().integer().default(3333),

  // Auth0
  AUTH0_DOMAIN: string().required(),
  AUTH0_AUDIENCE: string().required(),
  AUTH0_CLIENT_ID: string().required(),
  AUTH0_CLIENT_SECRET: string().required(),
});
