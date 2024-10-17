import Payment from '../entity/payments.entity';

export interface PaymentRepository {
  create(userId: number, seatId: number): Promise<Payment>;
}
