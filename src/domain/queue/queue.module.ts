import { Module } from '@nestjs/common';
import { QueueController } from './interface/controller/queue.controller';
import Queue from './domain/queue.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueRepositoryImpl } from './infrastructure/queueRepository.impl';
import { QueueService } from './application/queue.service';
import { CreateTokenUsecase } from './application/createToken.usecase';
import { CheckTokenUsecase } from './application/checkToken.usecase';
import { CookieAdapter } from './interface/adapter/Cookie.adapter';
import { OutTokenUsecase } from './application/outToken.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([Queue])],
  controllers: [QueueController],
  providers: [
    {
      provide: 'IQueueRepository',
      useClass: QueueRepositoryImpl,
    },
    QueueService,
    CreateTokenUsecase,
    CheckTokenUsecase,
    OutTokenUsecase,
    CookieAdapter,
  ],
})
export class QueueModule {}
