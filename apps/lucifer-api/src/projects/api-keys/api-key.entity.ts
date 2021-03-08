import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

import { IApiKeyWithKey } from '@lucifer/types';

import { Project } from '../project.entity';

// Entity
@Entity()
export class ApiKey implements IApiKeyWithKey {
  // Columns
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  adminId: string;

  @Column('varchar', { length: 100, nullable: false })
  projectId: string;

  @Column('varchar', { length: 100, nullable: false, default: '' })
  label: string;

  @Exclude()
  @Column('text', { nullable: false })
  @Index({ unique: true })
  key: string;

  // Relations
  @ManyToOne(() => Project, { nullable: false, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn([
    { name: 'adminId',   referencedColumnName: 'adminId' },
    { name: 'projectId', referencedColumnName: 'id' }
  ])
  project: Promise<Project>;
}
