import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule, // <--- Importar ConfigModule para que funcione el inject
  ],
  providers: [...databaseProviders],
  exports: [...databaseProviders], 
})
export class DatabaseModule {}