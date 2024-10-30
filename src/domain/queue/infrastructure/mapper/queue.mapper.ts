import { Queue } from '../../domain/entity/queue';
import QueueEntity from '../entity/queue.entity';

export class QueueMapper {
  static toDomain(entity: QueueEntity): Queue {
    return new Queue({
      id: entity.id,
      uuid: entity.uuid,
      status: entity.status,
      enteredAt: entity.enteredAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    });
  }

  static toEntity(domain: Queue): QueueEntity {
    const entity = new QueueEntity();
    entity.status = domain.status;
    entity.enteredAt = domain.enteredAt;
    return entity;
  }
}
