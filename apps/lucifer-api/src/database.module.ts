import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Module
@Module({
  imports: [
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
    })
  ]
})
export class DatabaseModule {}
