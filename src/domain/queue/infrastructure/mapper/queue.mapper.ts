import { Queue } from '../../domain/entity/queue';
import QueueEntity from '../entity/queue.entity';

export class QueueMapper {
  static toDomain(entity: QueueEntity): Queue {
    return new Queue({
      id: entity.id,
      uuid: entity.uuid,
      status: entity.status,
      activeAt: entity.activeAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    });
  }

  static toEntity(domain: Queue): QueueEntity {
    const entity = new QueueEntity();
    entity.status = domain.status;
    entity.activeAt = domain.activeAt;
    return entity;
  }
}
