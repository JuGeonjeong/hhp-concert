import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { DomainModule } from './domain/domain.module';
import { MysqlDataSource } from './common/config/database.config';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { LoggerModule } from './common/logger/logger.module';
import { CustomExceptionFilter } from './common/filter/exception.filter';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => MysqlDataSource.options,
    }),
    LoggerModule,
    DomainModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    { provide: APP_FILTER, useClass: CustomExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  ],
})
export class AppModule {}
