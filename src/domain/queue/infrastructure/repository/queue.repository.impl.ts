import { Injectable } from '@nestjs/common';
import { QueueRepository } from '../../domain/repository/queue.repository';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, LessThan } from 'typeorm';
import { Queue } from '../../domain/entity/queue';
import QueueEntity, { QueueStatusEnum } from '../entity/queue.entity';
import { QueueMapper } from '../mapper/queue.mapper';

@Injectable()
export class QueueRepositoryImpl implements QueueRepository {
  constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

  async create(queue): Promise<Queue> {
    const entity = QueueMapper.toEntity(queue);
    const queueEntity = await this.manager.save(entity);
    return QueueMapper.toDomain(queueEntity);
  }

  async findOne(uuid: string): Promise<Queue> {
    const entity = await this.manager.findOne(QueueEntity, { where: { uuid } });
    return QueueMapper.toDomain(entity);
  }

  async update(queue: Queue, data: Partial<Queue>): Promise<Queue> {
    Object.assign(queue, data);
    const entity = QueueMapper.toEntity(queue);
    const queueEntity = await this.manager.save(entity);
    return QueueMapper.toDomain(queueEntity);
  }

  async findStatusEnter(): Promise<Queue> {
    const entity = await this.manager.findOne(QueueEntity, {
      where: { status: QueueStatusEnum.ENTER },
      order: { id: 'DESC' },
    });
    return QueueMapper.toDomain(entity);
  }

  async waitingCount(): Promise<number> {
    return await this.manager.count(QueueEntity, {
      where: { status: QueueStatusEnum.WAIT },
    });
  }

  async ghostQueue(): Promise<Queue[]> {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    console.log(tenMinutesAgo);

    const entities = await this.manager.find(QueueEntity, {
      where: {
        status: QueueStatusEnum.ENTER,
        enteredAt: LessThan(tenMinutesAgo),
      },
    });
    return entities.map(QueueMapper.toDomain);
  }

  // 대기중 상태 대기열 5개 불러오기
  async getWaitingQueue(limit): Promise<Queue[]> {
    const entities = await this.manager
      .createQueryBuilder(QueueEntity, 'queue')
      .andWhere('queue.status = :status', {
        status: QueueStatusEnum.WAIT,
      })
      .orderBy('queue.createdAt', 'ASC')
      .limit(limit)
      .getMany();

    return entities.map((entity) => QueueMapper.toDomain(entity));
  }

  // 만료시간 초과 대기열 조회
  async findExpiredQueues(): Promise<Queue[]> {
    const now = new Date();
    const entities = await this.manager
      .createQueryBuilder(QueueEntity, 'queue')
      .where('queue.expiredAt <= :now', { now })
      .andWhere('queue.status = :status', {
        status: QueueStatusEnum.ENTER,
      })
      .getMany();
    return entities.map(QueueMapper.toDomain);
  }

  // 대기열 상태 업데이트
  async updateQueues(queues: Queue[]): Promise<void> {
    const entities = queues.map((queue) => QueueMapper.toEntity(queue));
    await this.manager.save(entities);
  }
}
