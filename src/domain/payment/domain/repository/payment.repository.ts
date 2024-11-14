import { EntityManager } from 'typeorm';
import { Payment } from '../entity/payment';

export interface PaymentRepository {
  create(payment: Payment): Promise<Payment>;
  findOne(orderKey: string): Promise<Payment>;
  save(transactionManager: EntityManager, payment: Payment): Promise<Payment>;
}
