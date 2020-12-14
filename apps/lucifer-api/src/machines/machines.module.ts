import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Machine } from './machine.entity';

// Module
@Module({
  imports: [
    TypeOrmModule.forFeature([Machine])
  ]
})
export class MachinesModule {}
