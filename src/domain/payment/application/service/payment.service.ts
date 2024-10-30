import { Inject, Injectable } from '@nestjs/common';
import { PaymentRepository } from '../../domain/repository/payment.repository';
import { Payment } from '../../domain/entity/payment';

@Injectable()
export class PaymentService {
  constructor(
    @Inject('IPaymentRepository')
    private readonly paymentRepository: PaymentRepository,
  ) {}

  async create(userId: number, seatId: number) {
    const payment = new Payment({
      seatId,
      userId,
    });
    return await this.paymentRepository.create(payment);
  }
}
