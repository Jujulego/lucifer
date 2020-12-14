import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';

// Module
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const options = await getConnectionOptions();

        return {
          ...options,
          autoLoadEntities: true,
          entities: [],
          migrations: [],
        };
      }
    })
  ],
  exports: [
    TypeOrmModule
  ]
})
export class DatabaseModule {}
