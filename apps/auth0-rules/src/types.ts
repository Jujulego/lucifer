import type { Strategy, User } from 'auth0';

// Aliases
export type Protocol =
  'oidc-basic-profile' | 'oidc-implicit-profile' |
  'oauth2-device-code' | 'oauth2-resource-owner' | 'oauth2-resource-owner-jwt-bearer' | 'oauth2-password' | 'oauth2-refresh-token' |
  'samlp' | 'wsfed' |
  'wstrust-usernamemixed' |
  'delegation' |
  'redirect-callback';

export type RuleCallback = (error: any, user: RuleUser, context: RuleContext) => void;

// Types
export interface RuleUser extends User {
  permissions: string[];
}

export interface RuleContext {
  tenant: string;
  clientId: string;
  clientName: string;
  clientMetadata: Record<string, string>;
  connectionId: string;
  connection: string;
  connectionStrategy: Strategy;
  connectionOptions: any;
  connectionMetadata: Record<string, string>;
  samlConfiguration?: any;
  protocol: Protocol;
  riskAssessment: any;
  stats: any;
  sso?: {
    with_auth0: boolean;
    with_dbconn: boolean;
    current_clients: string[];
  };
  accessToken: Record<string, any>;
  idToken: Record<string, any>;
  original_protocol: Protocol;
  multifactor: any;
  sessionId: string;
  request?: {
    userAgent: string;
    ip: string;
    hostname: string;
    query: any;
    body: any;
    geoip: {
      country_code: string;
      country_code3: string;
      country_name: string;
      city_name: string;
      latitude: string;
      longitude: string;
      time_zone: string;
      continent_code: string;
    };
  };
  primaryUser: string;
  authentification: {
    methods: {
      name: 'federated' | 'pwd' | 'sms' | 'email' | 'mfa';
      timestamp: number;
    }[];
  };
  authorization: {
    roles: string[];
  };
}
