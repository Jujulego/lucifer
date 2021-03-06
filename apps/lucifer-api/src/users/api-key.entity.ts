import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

import { IApiKeyWithKey } from '@lucifer/types';

import { LocalUser } from './local-user.entity';

// Entity
@Entity()
export class ApiKey implements IApiKeyWithKey {
  // Columns
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  userId: string;

  @Column('varchar', { length: 100, nullable: false, default: '' })
  label: string;

  @Exclude()
  @Column('text', { nullable: false })
  @Index({ unique: true })
  key: string;

  // Relations
  @ManyToOne(() => LocalUser, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: Promise<LocalUser>
}
