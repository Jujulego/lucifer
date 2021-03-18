import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { IProject } from '@lucifer/types';

import { ProjectMember } from './project-member.entity';

// Entity
@Entity()
export class Project implements IProject {
  // Columns
  @PrimaryColumn('varchar', { length: 100, nullable: false })
  id: string;

  @Column('varchar', { length: 100, nullable: false })
  name: string;

  @Column('text', { default: '', nullable: false })
  description: string;

  // Relations
  @OneToMany(() => ProjectMember, mmb => mmb.project)
  members: ProjectMember[];
}
