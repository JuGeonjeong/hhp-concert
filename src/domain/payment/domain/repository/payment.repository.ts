import { Payment } from '../entity/payment';

export interface PaymentRepository {
  create(payment: Payment): Promise<Payment>;
}
