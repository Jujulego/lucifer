import { Expose } from 'class-transformer';

// Types
export type Role = 'admin' | 'reader';

// Constants
export const ROLES: Role[] = ['admin', 'reader'];

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
  roles?:     Role[];
}

export interface IUpdateUser {
  name?:  string;
  email?: string;
  roles?: Role[];
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

  //@Expose({ groups: ['read:roles'] })
  roles?: Role[];
}
