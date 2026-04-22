import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'dev_user',
      password: 'dev_password',
      database: 'gestao_db',
      autoLoadEntities: true,
      synchronize: true, 
    }),
  ],
})
export class AppModule {}