import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { IProject } from '@lucifer/types';

import { LocalUser } from '../users/local-user.entity';

// Entity
@Entity()
export class Project implements IProject {
  // Columns
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100 })
  name: string;

  @Column('text', { nullable: true })
  description?: string;

  @Column('varchar')
  adminId: string;

  // Relations
  @ManyToOne(() => LocalUser, usr => usr.projects, { nullable: false })
  @JoinColumn({ name: 'adminId' })
  admin: Promise<LocalUser>;
}
