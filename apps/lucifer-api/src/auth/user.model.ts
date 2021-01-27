import type { Permission } from '@lucifer/types';

// Model
export interface AuthUser {
  sub: string;
  permissions: Permission[];
}
