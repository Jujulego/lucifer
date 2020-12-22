import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConnectionOptionsReader } from 'typeorm';

import { MIGRATIONS } from './db/migrations';
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
            root: __dirname.replace(/\\dist/, ''),
          });

          options = await reader.get('default');
        }

        return {
          ...options,
          autoLoadEntities: true,
          entities: [],
          migrations: MIGRATIONS,
        };
      }
    })
  ],
  exports: [
    TypeOrmModule
  ]
})
export class DatabaseModule {}
