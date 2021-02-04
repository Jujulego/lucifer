import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatabaseUtils } from './utils';

// Module
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        ...await DatabaseUtils.getConnectionOptions(),
        autoLoadEntities: true,
        entities: []
      })
    })
  ],
  exports: [
    TypeOrmModule
  ]
})
export class DatabaseModule {}
