import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import Payment from './domain/entity/payments.entity';
import { PaymentController } from './interface/payment.controller';
import { PaymentService } from './application/payment.service';
import { PaySeatUsecase } from './application/paySeat.usecase';
import { PaymentRepositoryImpl } from './infrastructure/paymentRepository.impl';
import { SeatService } from '../concert/application/service/seat.service';
import { SeatRepositoryImpl } from '../concert/infrastructure/seatRepository.impl';
import { PointService } from '../user/application/service/point.service';
import { PointRepositoryImpl } from '../user/infrastructure/database/pointRepository.impl';
import { UserService } from '../user/application/service/user.service';
import { QueueService } from '../queue/application/queue.service';
import { QueueRepositoryImpl } from '../queue/infrastructure/queueRepository.impl';
import { UserRepositoryImpl } from '../user/infrastructure/database/userRepository.impl';
import Payments from './domain/entity/payments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payments])],
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
    PaySeatUsecase,
    PaymentService,
    SeatService,
    PointService,
    QueueService,
    UserService,
  ],
})
export class PaymentModule {}
