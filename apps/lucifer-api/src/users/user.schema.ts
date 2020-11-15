import { IsEmail, IsOptional, IsString } from 'class-validator';

// Schemas
export class UpdateUser {
  // Attributes
  @IsEmail() @IsOptional()
  email?: string;

  @IsString() @IsOptional()
  name?:  string;
}
