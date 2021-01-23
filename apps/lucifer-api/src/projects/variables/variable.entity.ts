import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { IVariable } from '@lucifer/types';

import { Project } from '../project.entity';

// Entity
@Entity()
export class Variable implements IVariable {
  // Columns
  @PrimaryColumn('varchar')
  adminId: string;

  @PrimaryColumn('varchar', { length: 100, nullable: false })
  projectId: string;

  @PrimaryColumn('varchar', { length: 100, nullable: false })
  name: string;

  @Column('text', { nullable: true })
  value: string | null;

  // Relations
  @ManyToOne(() => Project, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn([
    { name: 'adminId',   referencedColumnName: 'adminId' },
    { name: 'projectId', referencedColumnName: 'id' }
  ])
  project: Promise<Project>;
}
