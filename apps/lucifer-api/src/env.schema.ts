import joi from 'joi';

// Schema
export const envSchema = joi.object({
  // Basic config
  NODE_ENV: joi.string().default('local'),
  PORT: joi.number().port().default(3333)
});
