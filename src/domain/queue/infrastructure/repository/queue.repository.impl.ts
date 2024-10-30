import { Injectable } from '@nestjs/common';
import { QueueRepository } from '../../domain/repository/queue.repository';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, LessThan } from 'typeorm';
import { Queue } from '../../domain/entity/queue';
import { QueueStatusEnum } from '../entity/queue.entity';
import { QueueMapper } from '../mapper/queue.mapper';

@Injectable()
export class QueueRepositoryImpl implements QueueRepository {
  constructor(
    @InjectEntityManager() private readonly manager: EntityManager, // 엔티티 제거
  ) {}

  async create(queue): Promise<Queue> {
    const entity = QueueMapper.toEntity(queue);
    const queueEntity = await this.manager.save(entity);
    return QueueMapper.toDomain(queueEntity);
  }

  async findOne(uuid: string): Promise<Queue> {
    const entity = await this.manager.findOne(Queue, { where: { uuid } });
    return QueueMapper.toDomain(entity);
  }

  async update(queue: Queue, data: Partial<Queue>): Promise<Queue> {
    Object.assign(queue, data);
    const entity = QueueMapper.toEntity(queue);
    const queueEntity = await this.manager.save(entity);
    return QueueMapper.toDomain(queueEntity);
  }

  async findStatusEnter(): Promise<Queue> {
    const entity = await this.manager.findOne(Queue, {
      where: { status: QueueStatusEnum.ENTER },
      order: { id: 'DESC' },
    });
    return QueueMapper.toDomain(entity);
  }

  async waitingCount(): Promise<number> {
    return await this.manager.count(Queue, {
      where: { status: QueueStatusEnum.WAIT },
    });
  }

  async ghostQueue(): Promise<Queue[]> {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    console.log(tenMinutesAgo);

    const entities = await this.manager.find(Queue, {
      where: {
        status: QueueStatusEnum.ENTER,
        activeAt: LessThan(tenMinutesAgo),
      },
    });
    return entities.map(QueueMapper.toDomain);
  }
}
