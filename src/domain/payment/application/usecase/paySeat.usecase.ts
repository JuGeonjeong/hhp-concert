import { Inject } from '@nestjs/common';
import { PaymentService } from '../service/payment.service';

export class PaySeatUsecase {
  constructor(
    @Inject(PaymentService)
    private readonly paymentService: PaymentService,
  ) {}

  async pay(request) {
    const { orderKey } = request;
    const payment = await this.paymentService.findOne(orderKey);
    return await this.paymentService.pay(payment);
  }
}
