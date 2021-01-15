import { User } from '@auth0/auth0-spa-js';
import { RoleName } from '@lucifer/types';

// Constants
export const ROLES_KEY = 'https://lucifer-front/roles';

// Class
export interface AuthUser extends User {
  // Attributes
  id: string;
  email: string;
  name: string;
  email_verified: boolean;
  nickname: string;
  picture: string;
  updated_at: string;
  sub: string;
  [ROLES_KEY]: RoleName[];
}
