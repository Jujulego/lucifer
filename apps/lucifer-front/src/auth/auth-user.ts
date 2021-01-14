import { User } from '@auth0/auth0-spa-js';

// Constants
export const ROLES = 'https://lucifer-front/roles';

// Types
export type Role = 'admin' | 'reader';

// Class
export interface AuthUser extends User{
  // Attributes
  id: string;
  email: string;
  name: string;
  email_verified: boolean;
  nickname: string;
  picture: string;
  updated_at: string;
  sub: string;
  [ROLES]: Role[];
}
