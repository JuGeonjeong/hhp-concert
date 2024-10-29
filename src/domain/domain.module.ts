import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConcertModule } from './concert/concert.module';
import { PaymentModule } from './payment/payment.module';
import { QueueModule } from './queue/queue.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import Payment from './payment/domain/entity/payment.entity';
import User from './user/domain/entity/user.entity';
import Concert from './concert/domain/entity/concert.entity';
import Seat from './concert/domain/entity/seat.entity';
import Queue from './queue/domain/entity/queue.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, User, Concert, Seat, Queue]),
    UserModule,
    ConcertModule,
    PaymentModule,
    QueueModule,
  ],
})
export class DomainModule {}
