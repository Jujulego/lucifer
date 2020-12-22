import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConnectionOptionsReader } from 'typeorm';
import * as path from 'path';

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
          let root = __dirname;
          if (root.endsWith('src')) {
            root = path.dirname(__dirname);
          } else {
            root = root.replace(/\\dist/, '');
          }

          const reader = new ConnectionOptionsReader({ root });
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
