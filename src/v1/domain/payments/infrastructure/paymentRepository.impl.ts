import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { PaymentRepository } from '../domain/repository/payment.repository';
import Payment from '../domain/entity/payments.entity';

@Injectable()
export class PaymentRepositoryImpl implements PaymentRepository {
  constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

  async create(userId, seatId): Promise<Payment> {
    const payment = this.manager.create(Payment, { userId, seatId });
    return await this.manager.save(payment);
  }
}
