import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

export class PaymentSuccessEvent {
  constructor(public orderKey: string) {}
}

@Injectable()
export class PaymentEventPublisher {
  constructor(private eventEmitter: EventEmitter2) {}

  async success(event: PaymentSuccessEvent) {
    this.eventEmitter.emit('payment.success', event);
  }
}
