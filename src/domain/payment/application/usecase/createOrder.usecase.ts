import { Inject } from '@nestjs/common';
import { PaymentService } from '../service/payment.service';

export class CreateOrderUsecase {
  constructor(
    @Inject(PaymentService)
    private readonly paymentService: PaymentService,
  ) {}

  async create(request) {
    return await this.paymentService.create(request);
  }
}
