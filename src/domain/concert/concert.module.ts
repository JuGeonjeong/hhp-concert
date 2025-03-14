import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcertController } from './interface/api/concert.controller';
import { AvailableDatesUsecase } from './application/usecase/availableDates.usecase';
import { AvailableSeatsUsecase } from './application/usecase/availableSeats.usecase';
import { TakeSeatUsecase } from './application/usecase/takeSeat.usecase';
import ConcertEntity from './infrastructure/entity/concert.entity';
import SeatEntity from './infrastructure/entity/seat.entity';
import ScheduleEntity from './infrastructure/entity/schedule.entity';
import { ConcertRepositoryImpl } from './infrastructure/repository/concert.repository.impl';
import { ScheduleRepositoryImpl } from './infrastructure/repository/schedule.repository.impl';
import { SeatRepositoryImpl } from './infrastructure/repository/seat.repository.impl';
import { CreateOrderUsecase } from '../payment/application/usecase/createOrder.usecase';
import { PaymentService } from '../payment/domain/service/payment.service';
import { PaymentRepositoryImpl } from '../payment/infrastructure/repository/payment.repository.impl';
import { PaymentEventPublisher } from '../payment/application/event/paymentEventPublisher';
import { UserRepositoryImpl } from '../user/infrastructure/repository/user.repository.impl';
import { PointRepositoryImpl } from '../user/infrastructure/repository/point.repository.impl';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PointService } from '../user/domain/service/point.service';
import { UserService } from '../user/domain/service/user.service';
import { ConcertFacade } from './application/concert.facade';
import { ConcertFacadeImpl } from './application/concert.facade.impl';
import { ConcertService } from './domain/service/concert.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConcertEntity, ScheduleEntity, SeatEntity]),
  ],
  controllers: [ConcertController],
  providers: [
    {
      provide: ConcertFacade,
      useClass: ConcertFacadeImpl,
    },
    {
      provide: 'IConcertRepository',
      useClass: ConcertRepositoryImpl,
    },
    {
      provide: 'IScheduleRepository',
      useClass: ScheduleRepositoryImpl,
    },
    {
      provide: 'ISeatRepository',
      useClass: SeatRepositoryImpl,
    },
    {
      provide: 'IPaymentRepository',
      useClass: PaymentRepositoryImpl,
    },
    {
      provide: 'IUserRepository',
      useClass: UserRepositoryImpl,
    },
    {
      provide: 'IPointRepository',
      useClass: PointRepositoryImpl,
    },
    ConcertService,
    PaymentService,
    UserService,
    PointService,
    CreateOrderUsecase,
    AvailableDatesUsecase,
    AvailableSeatsUsecase,
    TakeSeatUsecase,
    EventEmitter2,
    PaymentEventPublisher,
  ],
})
export class ConcertModule {}
