import { Inject, Injectable } from '@nestjs/common';
import { OnEventSafe } from '../../interface/decorator/on-event-safe.decorator';
import { PaymentSuccessEvent } from './paymentEventPublisher';
import { DataPlatformSendService } from 'src/common/service/dataPlatformSend.service';
import { PaymentRepository } from '../../domain/repository/payment.repository';

@Injectable()
export class PaymentEventListener {
  constructor(
    private readonly sendService: DataPlatformSendService,
    @Inject('IPaymentRepository')
    private readonly paymentRepository: PaymentRepository,
  ) {}

  @OnEventSafe('payment.success')
  async paymentSuccessHandler(event: PaymentSuccessEvent) {
    const paymentList = await this.paymentRepository.findOne(event.orderKey);
    this.sendService.send(paymentList);
  }
}
