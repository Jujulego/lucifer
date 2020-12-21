import { IsEmail, IsOptional, IsString } from 'class-validator';

import { IUpdateUser } from '@lucifer/types';

// Schemas
export class UpdateUser implements IUpdateUser {
  // Attributes
  @IsEmail() @IsOptional()
  email?: string;

  @IsString() @IsOptional()
  name?:  string;
}
