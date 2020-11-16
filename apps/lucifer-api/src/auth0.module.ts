import { Module } from '@nestjs/common';

import { AuthenticationClient, ManagementClient } from 'auth0';

import { env } from './env';

// Module
@Module({
  providers: [
    {
      provide: AuthenticationClient,
      useFactory: () => new AuthenticationClient({
        domain: env.AUTH0_DOMAIN,
        clientId: env.AUTH0_CLIENT_ID
      })
    },
    {
      provide: ManagementClient,
      useFactory: () => new ManagementClient({
        domain: env.AUTH0_DOMAIN,
        clientId: env.AUTH0_CLIENT_ID,
        clientSecret: env.AUTH0_CLIENT_SECRET,
        scope: 'read:users update:users'
      })
    }
  ],
  exports: [
    AuthenticationClient,
    ManagementClient
  ]
})
export class Auth0Module {}
