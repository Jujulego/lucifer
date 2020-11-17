import { IUser } from '@lucifer/types';

// Interface
export interface AuthUser extends IUser {
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
export function isAuthUser(user: IUser): user is AuthUser {
  return 'sub' in user;
}
