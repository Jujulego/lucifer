import { Type } from 'class-transformer';

// Model
export class User {
  // Attributes
  id:         string;
  email:      string;
  name:       string;
  emailVerified?: boolean;
  nickname?:  string;
  username?:  string;
  givenName?: string;
  familyName?: string;
  picture?:   string;
  lastIp?:    string;
  lastLogin?: string;
  blocked?:   boolean;

  @Type(() => Date) createdAt?: string;
  @Type(() => Date) updatedAt?: string;
}
