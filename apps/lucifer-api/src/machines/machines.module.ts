import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';

import { Machine } from './machine.entity';
import { MachinesService } from './machines.service';
import { MachinesController } from './machines.controller';

// Module
@Module({
  imports: [
    TypeOrmModule.forFeature([Machine]),
    UsersModule,
  ],
  providers: [
    MachinesService
  ],
  controllers: [
    MachinesController
  ]
})
export class MachinesModule {}
