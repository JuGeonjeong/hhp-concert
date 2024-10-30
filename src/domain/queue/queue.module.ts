import { Module } from '@nestjs/common';
import { QueueController } from './interface/controller/queue.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueRepositoryImpl } from './infrastructure/repository/queue.repository.impl';
import { CreateTokenUsecase } from './application/usecase/createToken.usecase';
import { CheckTokenUsecase } from './application/usecase/checkToken.usecase';
import { CookieAdapter } from './interface/adapter/Cookie.adapter';
import { OutTokenUsecase } from './application/usecase/outToken.usecase';
import { ScheduleModule } from '@nestjs/schedule';
import { QueueService } from './application/service/queue.service';
import QueueEntity from './infrastructure/entity/queue.entity';

@Module({
  imports: [ScheduleModule.forRoot(), TypeOrmModule.forFeature([QueueEntity])],
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
