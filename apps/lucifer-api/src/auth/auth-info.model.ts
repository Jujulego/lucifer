import type { IApiKey, Permission } from '@lucifer/types';

// Models
export interface JwtToken {
  sub: string;
  permissions: Permission[];
}

interface BaseAuthInfo {
  permissions: Permission[];
}

export interface AuthUser extends BaseAuthInfo {
  kind: 'user';
  userId: string;
}

export interface AuthApiKey extends BaseAuthInfo {
  kind: 'api-key';
  apiKey: IApiKey;
}

export type AuthInfo = AuthUser | AuthApiKey;
