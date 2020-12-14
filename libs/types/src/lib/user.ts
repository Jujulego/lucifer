import { Type } from 'class-transformer';

import { IMachine, Machine } from './machine';

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

  machines: IMachine[];
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

  @Type(() => Machine)
  machines: Machine[];
}
