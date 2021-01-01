import { IsOptional, IsString } from 'class-validator';

import { ICreateMachine, IUpdateMachine } from '@lucifer/types';

// Schemas
export class CreateMachine implements ICreateMachine {
  // Attributes
  @IsString()
  shortName: string;
}

export class UpdateMachine implements IUpdateMachine {
  // Attributes
  @IsOptional() @IsString()
  shortName?: string;
}
