import { Module } from '@nestjs/common';
import { QueueController } from './interface/api/queue.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueRepositoryImpl } from './infrastructure/repository/queue.repository.impl';
import { CreateTokenUsecase } from './application/usecase/createToken.usecase';
import { CheckTokenUsecase } from './application/usecase/checkToken.usecase';
import { CookieAdapter } from './interface/adapter/Cookie.adapter';
import { OutTokenUsecase } from './application/usecase/outToken.usecase';
import { ScheduleModule } from '@nestjs/schedule';
import { QueueService } from './domain/service/queue.service';
import QueueEntity from './infrastructure/entity/queue.entity';
import { UserRepositoryImpl } from '../user/infrastructure/repository/user.repository.impl';
import { QueueFacadeImpl } from './application/queue.facade.impl';
import { QueueFacade } from './application/queue.facade';

@Module({
  imports: [ScheduleModule.forRoot(), TypeOrmModule.forFeature([QueueEntity])],
  controllers: [QueueController],
  providers: [
    {
      provide: QueueFacade,
      useClass: QueueFacadeImpl,
    },
    {
      provide: 'IQueueRepository',
      useClass: QueueRepositoryImpl,
    },
    {
      provide: 'IUserRepository',
      useClass: UserRepositoryImpl,
    },
    QueueService,
    CreateTokenUsecase,
    CheckTokenUsecase,
    OutTokenUsecase,
    CookieAdapter,
  ],
})
export class QueueModule {}
