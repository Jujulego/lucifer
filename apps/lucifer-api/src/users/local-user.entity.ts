import { Entity, PrimaryColumn } from 'typeorm';

import { Machine } from '../machines/machine.entity';
import { Project } from '../projects/project.entity';

@Entity('user')
export class LocalUser {
  // Columns
  @PrimaryColumn('varchar')
  id: string;
}
