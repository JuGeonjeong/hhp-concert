import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { DomainModule } from './domain/domain.module';
import { MysqlDataSource } from './common/config/database.config';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    DomainModule,
    TypeOrmModule.forRootAsync({
      useFactory: async () => MysqlDataSource.options,
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
