// Types
export type RoleName = 'admin' | 'reader';

// Constant
export const ROLES: RoleName[] = ['admin', 'reader'];

// Interface
export interface IUser {
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
  roles?:     RoleName[];
}
