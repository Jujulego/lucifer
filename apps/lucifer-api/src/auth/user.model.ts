import type { Permission } from '@lucifer/types';

// Models
export interface JwtToken {
  sub: string;
  permissions: Permission[];
}

export interface AuthUser {
  id: string;
  permissions: Permission[];
}
