import { Column, Entity, PrimaryColumn } from 'typeorm';

import { IProject } from '@lucifer/types';

// Entity
@Entity()
export class Project implements IProject {
  // Columns
  @PrimaryColumn('varchar', { length: 100, nullable: false })
  id: string;

  @Column('varchar', { length: 100, nullable: false })
  name: string;

  @Column('text', { default: '', nullable: false })
  description: string;
}
