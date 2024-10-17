import Payment from '../entity/payment.entity';

export interface PaymentRepository {
  create(userId: number, seatId: number): Promise<Payment>;
}
