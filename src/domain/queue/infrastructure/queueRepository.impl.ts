import { Injectable } from '@nestjs/common';
import { QueueRepository } from '../domain/queue.repository';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, LessThan } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import Queue, { QueueStatusEnum } from '../domain/queue.entity';

@Injectable()
export class QueueRepositoryImpl implements QueueRepository {
  constructor(
    @InjectEntityManager() private readonly manager: EntityManager, // 엔티티 제거
  ) {}

  async create(): Promise<Queue> {
    const queue = new Queue();
    console.log('Queue 생성:', queue);
    queue.uuid = uuidv4();
    return await this.manager.save(queue);
  }

  async findOne(uuid: string): Promise<Queue> {
    return await this.manager.findOne(Queue, { where: { uuid } });
  }

  async update(queue: Queue, data: Partial<Queue>): Promise<Queue> {
    Object.assign(queue, data);
    return await this.manager.save(queue);
  }

  async findStatusEnter(): Promise<Queue> {
    return await this.manager.findOne(Queue, {
      where: { status: QueueStatusEnum.ENTER },
      order: { id: 'DESC' },
    });
  }

  async waitingCount(): Promise<number> {
    return await this.manager.count(Queue, {
      where: { status: QueueStatusEnum.WAIT },
    });
  }

  async ghostQueue(): Promise<Queue[]> {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    console.log(tenMinutesAgo);

    const data = await this.manager.find(Queue, {
      where: {
        status: QueueStatusEnum.ENTER,
        activeAt: LessThan(tenMinutesAgo),
      },
    });
    console.log(data);
    return data;
  }
}
