import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Expose } from 'class-transformer';

import { IApiKeyWithKey } from '@lucifer/types';

import { LocalUser } from './local-user.entity';

// Entity
@Entity()
export class ApiKey implements IApiKeyWithKey {
  // Columns
  @PrimaryColumn('varchar')
  userId: string;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100, nullable: false, default: '' })
  label: string;

  @Expose({ groups: ['create:api-key'] })
  @Column('text', { nullable: false })
  @Index({ unique: true })
  key: string;

  // Relations
  @ManyToOne(() => LocalUser, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: Promise<LocalUser>
}
