import { Expose } from 'class-transformer';

import { IUser, RoleName } from './entity';

// Model
export class User implements IUser {
  // Attributes
  id:         string;
  email:      string;
  name:       string;
  canUpdate:  boolean;
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
