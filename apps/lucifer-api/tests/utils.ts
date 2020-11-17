import * as jwt from 'jsonwebtoken';

import { env } from '../src/env';
import { JWT_KEY } from '../src/auth/jwt.strategy';

// Utils
export async function generateToken(user: string, permissions?: string[]): Promise<string> {
  return jwt.sign({
    iss: `https://${env.AUTH0_DOMAIN}/`,
    aud: env.AUTH0_AUDIENCE,
    sub: user,
    permissions,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 5 * 60,
  }, JWT_KEY);
}
