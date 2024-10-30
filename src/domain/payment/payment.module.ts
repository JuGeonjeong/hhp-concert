import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import Payment from './domain/entity/payments.entity';
import { PaymentController } from './interface/payment.controller';
import { PaySeatUsecase } from './application/paySeat.usecase';
import { PaymentRepositoryImpl } from './infrastructure/paymentRepository.impl';
import { SeatRepositoryImpl } from '../concert/infrastructure/repository/seatRepository.impl';
import { QueueRepositoryImpl } from '../queue/infrastructure/queueRepository.impl';
import Payment from './domain/entity/payment.entity';
import { ConcertService } from '../concert/domain/service/concert.service';
import { ConcertRepositoryImpl } from '../concert/infrastructure/repository/concert.repository.impl';
import { ScheduleRepositoryImpl } from '../concert/infrastructure/repository/schedule.repository.impl';
import { PaymentService } from './domain/service/payment.service';
import { PointService } from '../user/domain/service/point.service';
import { QueueService } from '../queue/domain/service/queue.service';
import { UserService } from '../user/domain/service/user.service';
import { PointRepositoryImpl } from '../user/infrastructure/pointRepository.impl';
import { UserRepositoryImpl } from '../user/infrastructure/userRepository.impl';

@Module({
  imports: [TypeOrmModule.forFeature([Payment])],
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
    PaySeatUsecase,
    PaymentService,
    PointService,
    ConcertService,
    QueueService,
    UserService,
  ],
})
export class PaymentModule {}
