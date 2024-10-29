import { Module } from '@nestjs/common';
import { QueueController } from './interface/controller/queue.controller';
import Queue from './domain/entity/queue.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueRepositoryImpl } from './infrastructure/queueRepository.impl';
import { CreateTokenUsecase } from './application/usecase/createToken.usecase';
import { CheckTokenUsecase } from './application/usecase/checkToken.usecase';
import { CookieAdapter } from './interface/adapter/Cookie.adapter';
import { OutTokenUsecase } from './application/usecase/outToken.usecase';
import { ScheduleModule } from '@nestjs/schedule';
import { QueueService } from './domain/service/queue.service';

@Module({
  imports: [ScheduleModule.forRoot(), TypeOrmModule.forFeature([Queue])],
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
