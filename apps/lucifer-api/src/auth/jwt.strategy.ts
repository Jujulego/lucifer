import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import * as jwks from 'jwks-rsa';

import { env } from '../env';

import type { AuthUser, JwtToken } from './user.model';

// For tests
export const JWT_KEY = 'a25tp71kchu2m8h3qcrm8hishfv7vpw77mds';

// Strategy
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  // Constructor
  constructor() {
    const opts: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer: `https://${env.AUTH0_DOMAIN}/`,
      audience: env.AUTH0_AUDIENCE
    };

    if (env.TESTS) {
      opts.secretOrKey = JWT_KEY;
    } else {
      opts.algorithms = ['RS256'];
      opts.secretOrKeyProvider = jwks.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${env.AUTH0_DOMAIN}/.well-known/jwks.json`
      });
    }

    super(opts);
  }

  // Methods
  // noinspection JSUnusedGlobalSymbols
  validate(payload: JwtToken): AuthUser {
    return {
      id: payload.sub,
      permissions: payload.permissions
    }
  }
}
