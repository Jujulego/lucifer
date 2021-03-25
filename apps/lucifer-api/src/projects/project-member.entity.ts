import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { IProjectMember } from '@lucifer/types';

import { LocalUser } from '../users/local-user.entity';
import { Project } from './project.entity';

// Entity
@Entity()
export class ProjectMember implements IProjectMember {
  // Attributes
  @PrimaryColumn('varchar', { length: 100, nullable: false })
  projectId: string;

  @PrimaryColumn('varchar', { nullable: false })
  userId: string;

  @Column('boolean', { default: false, nullable: false })
  admin: boolean;

  // Relations
  @ManyToOne(() => Project, { nullable: false, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn({ name: 'projectId' })
  project: Promise<Project>;

  @ManyToOne(() => LocalUser, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: Promise<LocalUser>;
}
