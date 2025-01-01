import { Inject } from '@nestjs/common';
import { PaymentService } from '../../domain/service/payment.service';

export class PaySeatUsecase {
  constructor(
    @Inject(PaymentService)
    private readonly paymentService: PaymentService,
  ) {}

  async pay(request: any) {
    const { orderKey } = request;
    const payment = await this.paymentService.findOne(orderKey);
    return await this.paymentService.pay(payment);
  }
}
