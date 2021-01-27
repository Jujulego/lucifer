import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

import { ICreateVariable, IUpdateVariable } from '@lucifer/types';

// Schemas
export class CreateVariable implements ICreateVariable {
  // Attributes
  @IsString() @MaxLength(100) @Matches(/^[a-z0-9-]+$/)
  id: string;

  @IsString() @MaxLength(100)
  name: string;

  @IsString()
  value: string;
}

export class UpdateVariable implements IUpdateVariable {
  // Attributes
  @IsOptional() @IsString() @MaxLength(100)
  name?: string;

  @IsOptional() @IsString()
  value?: string;
}
