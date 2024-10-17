import { Inject, Injectable } from '@nestjs/common';
import { PaymentRepository } from '../domain/repository/payment.repository';

@Injectable()
export class PaymentService {
  constructor(
    @Inject('IPaymentRepository')
    private readonly paymentRepository: PaymentRepository,
  ) {}

  async create(userId: number, seatId: number) {
    const payment = await this.paymentRepository.create(userId, seatId);
    return payment;
  }
}
