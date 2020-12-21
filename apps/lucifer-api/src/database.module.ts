import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConnectionOptionsReader } from 'typeorm';
import path from 'path';

import { env } from './env';

// Module
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        let options: TypeOrmModuleOptions = {
          type: 'postgres',
          url: env.DATABASE_URL,
        }

        if (!env.DATABASE_URL) {
          const reader = new ConnectionOptionsReader({
            root: path.join(__dirname, '..'),
          });

          options = await reader.get('default');
        }

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
