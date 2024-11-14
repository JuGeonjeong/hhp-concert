import { Payment } from '../../domain/entity/payment';
import PaymentEntity from '../entity/payment.entity';

export class PaymentMapper {
  static toDomain(entity: PaymentEntity): Payment {
    return new Payment({
      id: entity.id,
      seatId: entity.seatId,
      userId: entity.userId,
      orderKey: entity.orderKey,
      status: entity.status,
      amount: entity.amount,
    });
  }

  static toEntity(domain: Payment): PaymentEntity {
    const entity = new PaymentEntity();
    entity.seatId = domain.seatId;
    entity.userId = domain.userId;
    entity.orderKey = domain.orderKey;
    entity.amount = domain.amount;
    entity.status = domain.status;
    return entity;
  }
}
