import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConcertModule } from './concert/concert.module';
import { PaymentModule } from './payment/payment.module';
import { QueueModule } from './queue/queue.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ConcertEntity from './concert/infrastructure/entity/concert.entity';
import SeatEntity from './concert/infrastructure/entity/seat.entity';
import PaymentEntity from './payment/infrastructure/entity/payment.entity';
import QueueEntity from './queue/infrastructure/entity/queue.entity';
import UserEntity from './user/infrastructure/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentEntity,
      UserEntity,
      ConcertEntity,
      SeatEntity,
      QueueEntity,
    ]),
    UserModule,
    ConcertModule,
    PaymentModule,
    QueueModule,
  ],
})
export class DomainModule {}
