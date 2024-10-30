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

  async create(payment): Promise<Payment> {
    const entity = PaymentMapper.toEntity(payment);
    const paymentEntity = await this.manager.save(PaymentEntity, entity);
    return PaymentMapper.toDomain(paymentEntity);
  }
}
