import { Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { Machine } from '../machines/machine.entity';

@Entity('user')
export class LocalUser {
  // Columns
  @PrimaryColumn('varchar')
  id: string;

  // Relations
  @OneToMany(() => Machine, mch => mch.owner)
  machines: Machine[];
}