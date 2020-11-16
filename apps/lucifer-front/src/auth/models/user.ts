import { User } from 'src/users/models/user';

// Interface
export interface AuthUser extends User {
  id: string;
  email: string;
  name: string;
  email_verified: boolean;
  nickname: string;
  picture: string;
  updated_at: string;
  sub: string;
}

// Utils
export function isAuthUser(user: User): user is AuthUser {
  return 'sub' in user;
}
