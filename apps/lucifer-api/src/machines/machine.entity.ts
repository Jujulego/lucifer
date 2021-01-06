import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { IMachine } from '@lucifer/types';

import { LocalUser } from '../users/local-user.entity';

@Entity()
export class Machine implements IMachine {
  // Columns
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 50 })
  shortName: string;

  @Column('varchar')
  ownerId: string;

  // Relations
  @ManyToOne(() => LocalUser, { nullable: false })
  @JoinColumn({ name: 'ownerId' })
  owner: Promise<LocalUser>;
}
