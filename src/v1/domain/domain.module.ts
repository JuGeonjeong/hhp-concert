import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConcertModule } from './concert/concert.module';
import { PaymentModule } from './payments/payment.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [UserModule, ConcertModule, PaymentModule, QueueModule],
  controllers: [],
  providers: [],
})
export class DomainModule {}
