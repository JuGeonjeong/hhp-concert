import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import Payment from './domain/entity/payments.entity';
import { PaySeatUsecase } from './application/usecase/paySeat.usecase';
import { PaymentRepositoryImpl } from './infrastructure/repository/payment.repository.impl';
import { PointRepositoryImpl } from '../user/infrastructure/repository/point.repository.impl';
import { QueueRepositoryImpl } from '../queue/infrastructure/repository/queue.repository.impl';
import { UserRepositoryImpl } from '../user/infrastructure/repository/user.repository.impl';
import { QueueService } from '../queue/domain/service/queue.service';
import { PaymentService } from './domain/service/payment.service';
import { ConcertRepositoryImpl } from '../concert/infrastructure/repository/concert.repository.impl';
import { ScheduleRepositoryImpl } from '../concert/infrastructure/repository/schedule.repository.impl';
import { SeatRepositoryImpl } from '../concert/infrastructure/repository/seat.repository.impl';
import PaymentEntity from './infrastructure/entity/payment.entity';
import { PaymentEventPublisher } from './application/event/paymentEventPublisher';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateOrderUsecase } from './application/usecase/createOrder.usecase';
import { PaymentController } from './interface/api/payment.controller';
import { PointService } from '../user/domain/service/point.service';
import { UserService } from '../user/domain/service/user.service';
import { PaymentFacade } from './application/payment.facade';
import { PaymentFacadeImpl } from './application/payment.facade.impl';
import { ConcertService } from '../concert/domain/service/concert.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity])],
  controllers: [PaymentController],
  providers: [
    {
      provide: PaymentFacade,
      useClass: PaymentFacadeImpl,
    },
    {
      provide: 'IPaymentRepository',
      useClass: PaymentRepositoryImpl,
    },
    {
      provide: 'ISeatRepository',
      useClass: SeatRepositoryImpl,
    },
    {
      provide: 'IPointRepository',
      useClass: PointRepositoryImpl,
    },
    {
      provide: 'IQueueRepository',
      useClass: QueueRepositoryImpl,
    },
    {
      provide: 'IUserRepository',
      useClass: UserRepositoryImpl,
    },
    {
      provide: 'IConcertRepository',
      useClass: ConcertRepositoryImpl,
    },
    {
      provide: 'IScheduleRepository',
      useClass: ScheduleRepositoryImpl,
    },
    PaymentEventPublisher,
    EventEmitter2,
    PaySeatUsecase,
    PaymentService,
    PointService,
    ConcertService,
    QueueService,
    UserService,
    CreateOrderUsecase,
  ],
})
export class PaymentModule {}
