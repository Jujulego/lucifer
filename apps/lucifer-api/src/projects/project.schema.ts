import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

import { ICreateProject, IUpdateProject } from '@lucifer/types';

// Schemas
export class CreateProject implements ICreateProject {
  // Attributes
  @IsString() @MaxLength(100) @Matches(/^[a-z0-9-]+$/)
  id: string;

  @IsString() @MaxLength(100)
  name: string;

  @IsOptional() @IsString()
  description?: string;
}

export class UpdateProject implements IUpdateProject {
  // Attributes
  @IsOptional() @IsString() @MaxLength(100)
  name?: string;

  @IsOptional() @IsString()
  description?: string;
}