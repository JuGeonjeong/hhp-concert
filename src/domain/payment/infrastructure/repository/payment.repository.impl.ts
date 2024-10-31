import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { PaymentRepository } from '../../domain/repository/payment.repository';
import { Payment } from '../../domain/entity/payment';
import { PaymentMapper } from '../mapper/payment.mappter';
import PaymentEntity from '../entity/payment.entity';

@Injectable()
export class PaymentRepositoryImpl implements PaymentRepository {
  constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

  async create(payment: Payment): Promise<Payment> {
    return await this.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager
          .createQueryBuilder(PaymentEntity, 'payment')
          .setLock('pessimistic_write') // 비관적 쓰기 락 설정
          .where('payment.userId = :userId', { userId: payment.userId })
          .getOne();

        const entity = PaymentMapper.toEntity(payment);

        const paymentEntity = await transactionalEntityManager.save(
          PaymentEntity,
          entity,
        );

        return PaymentMapper.toDomain(paymentEntity);
      },
    );
  }
}
