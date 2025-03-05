import { Inject } from '@nestjs/common';
import { PaymentService } from '../../domain/service/payment.service';

export class CreateOrderUsecase {
  constructor(
    @Inject(PaymentService)
    private readonly paymentService: PaymentService,
  ) {}

  async create(request: any) {
    return await this.paymentService.create(request);
  }
}
