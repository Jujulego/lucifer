import { Expose } from 'class-transformer';

// Types
export type RoleName = 'admin' | 'reader';

// Constants
export const ROLES: RoleName[] = ['admin', 'reader'];

// Interface
export interface IUser {
  // Attributes
  id:         string;
  email:      string;
  name:       string;
  emailVerified?: boolean;
  nickname?:  string;
  username?:  string;
  givenName?: string;
  familyName?: string;
  createdAt?: string;
  updatedAt?: string;
  picture?:   string;
  lastIp?:    string;
  lastLogin?: string;
  blocked?:   boolean;
  roles?:     RoleName[];
}

export interface IUpdateUser {
  name?:  string;
  email?: string;
  roles?: RoleName[];
}

// Model
export class User implements IUser {
  // Attributes
  id:         string;
  email:      string;
  name:       string;
  emailVerified?: boolean;
  nickname?:  string;
  username?:  string;
  givenName?: string;
  familyName?: string;
  createdAt?: string;
  updatedAt?: string;
  picture?:   string;
  lastIp?:    string;
  lastLogin?: string;
  blocked?:   boolean;

  @Expose({ groups: ['read:roles'] })
  roles?: RoleName[];
}
