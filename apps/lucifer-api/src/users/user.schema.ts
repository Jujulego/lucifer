import { IsEmail, IsIn, IsOptional, IsString } from 'class-validator';

import { IUpdateUser, RoleName, ROLES } from '@lucifer/types';

// Schemas
export class UpdateUser implements IUpdateUser {
  // Attributes
  @IsEmail() @IsOptional()
  email?: string;

  @IsString() @IsOptional()
  name?:  string;

  @IsIn(ROLES, { each: true }) @IsOptional()
  roles?: RoleName[];
}
