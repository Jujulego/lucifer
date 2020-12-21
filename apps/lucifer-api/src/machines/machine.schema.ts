import { IsString } from 'class-validator';

import { ICreateMachine } from '@lucifer/types';

// Schemas
export class CreateMachine implements ICreateMachine {
  // Attributes
  @IsString()
  shortName: string;
}
