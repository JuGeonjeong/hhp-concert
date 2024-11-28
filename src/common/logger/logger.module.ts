import { DynamicModule, Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';

@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {
  static forRoot(logLevel: 'debug' | 'info' | 'error'): DynamicModule {
    return {
      module: LoggerModule,
      providers: [{ provide: 'LOG_LEVEL', useValue: logLevel }, LoggerService],
      exports: [LoggerService],
    };
  }
}
