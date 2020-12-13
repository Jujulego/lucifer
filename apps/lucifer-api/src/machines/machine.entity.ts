import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { LocalUser } from '../users/local-user.entity';

@Entity()
export class Machine {
  // Columns
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 50 })
  shortName: string;

  @ManyToOne(() => LocalUser, usr => usr.machines, { nullable: false })
  owner: LocalUser;
}
