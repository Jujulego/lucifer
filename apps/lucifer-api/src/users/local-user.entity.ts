import { Entity, PrimaryColumn } from 'typeorm';

// Entity
@Entity('user')
export class LocalUser {
  // Columns
  @PrimaryColumn('varchar')
  id: string;
}
