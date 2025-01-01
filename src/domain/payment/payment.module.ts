import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import Payment from './domain/entity/payments.entity';
import { PaySeatUsecase } from './application/usecase/paySeat.usecase';
import { PaymentRepositoryImpl } from './infrastructure/repository/payment.repository.impl';
import { PointRepositoryImpl } from '../user/infrastructure/repository/point.repository.impl';
import { QueueRepositoryImpl } from '../queue/infrastructure/repository/queue.repository.impl';
import { UserRepositoryImpl } from '../user/infrastructure/repository/user.repository.impl';
import { PointService } from '../user/application/service/point.service';
import { QueueService } from '../queue/domain/service/queue.service';
import { UserService } from '../user/application/service/user.service';
import { PaymentService } from './application/service/payment.service';
import { ConcertService } from '../concert/application/service/concert.service';
import { ConcertRepositoryImpl } from '../concert/infrastructure/repository/concert.repository.impl';
import { ScheduleRepositoryImpl } from '../concert/infrastructure/repository/schedule.repository.impl';
import { SeatRepositoryImpl } from '../concert/infrastructure/repository/seat.repository.impl';
import PaymentEntity from './infrastructure/entity/payment.entity';
import { PaymentEventPublisher } from './application/event/paymentEventPublisher';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateOrderUsecase } from './application/usecase/createOrder.usecase';
import { PaymentController } from './interface/api/payment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity])],
  controllers: [PaymentController],
  providers: [
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
