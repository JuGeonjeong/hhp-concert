import { Queue } from '../../domain/entity/queue';
import QueueEntity, { QueueStatusEnum } from '../entity/queue.entity';

export class QueueMapper {
  static toDomain(entity: QueueEntity): Queue {
    return new Queue({
      id: entity.id,
      uuid: entity.uuid,
      status: entity.status,
      enteredAt: entity.enteredAt,
      expiredAt: entity.expiredAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    });
  }

  static toEntity(domain: {
    id: number;
    uuid: string;
    status: QueueStatusEnum;
    enteredAt: Date;
    expiredAt: Date;
  }): QueueEntity {
    const entity = new QueueEntity();
    entity.id = domain.id;
    entity.uuid = domain.uuid;
    entity.status = domain.status;
    entity.enteredAt = domain.enteredAt;
    entity.expiredAt = domain.expiredAt;
    return entity;
  }
}
