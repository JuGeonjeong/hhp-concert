import { Inject } from '@nestjs/common';
import { PaymentFacade } from './payment.facade';
import { CreateOrderUsecase } from './usecase/createOrder.usecase';
import { PaySeatUsecase } from './usecase/paySeat.usecase';

export class PaymentFacadeImpl implements PaymentFacade {
  constructor(
    @Inject(CreateOrderUsecase)
    private readonly createOrderUsecase: CreateOrderUsecase,
    @Inject(PaySeatUsecase)
    private readonly paySeatUsecase: PaySeatUsecase,
  ) {}

  /**
   * @see {PaymentFacade.createPayment}
   */
  create(aggregate: any): Promise<any> {
    return this.createOrderUsecase.create(aggregate);
  }

  /**
   * @see {PaymentFacade.paySeat}
   */
  paySeat(aggregate: any): Promise<any> {
    return this.paySeatUsecase.pay(aggregate);
  }
}
