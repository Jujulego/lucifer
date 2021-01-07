import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { IProject } from '@lucifer/types';

import { LocalUser } from '../users/local-user.entity';

// Entity
@Entity()
export class Project implements IProject {
  // Columns
  @PrimaryColumn('varchar')
  adminId: string;

  @PrimaryColumn('varchar', { length: 100, nullable: false })
  id: string;

  @Column('varchar', { length: 100, nullable: false })
  name: string;

  @Column('text', { default: '', nullable: false })
  description: string;

  // Relations
  @ManyToOne(() => LocalUser, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'adminId' })
  admin: Promise<LocalUser>;
}
