import { Payment } from '../../domain/entity/payment';
import PaymentEntity from '../entity/payment.entity';

export class PaymentMapper {
  static toDomain(entity: PaymentEntity): Payment {
    return new Payment({
      id: entity.id,
      seatId: entity.seatId,
      userId: entity.userId,
    });
  }

  static toEntity(domain: Payment): PaymentEntity {
    const entity = new PaymentEntity();
    entity.seatId = domain.seatId;
    entity.userId = domain.userId;
    return entity;
  }
}
