import { Type } from 'class-transformer';

import { IUser, User } from './user';

// Interface
export interface IMachine {
  // Attributes
  id:        string;
  shortName: string;
  owner:     IUser;
}

// Model
export class Machine implements IMachine {
  // Attributes
  id:        string;
  shortName: string;

  @Type(() => User)
  owner:     User;
}
