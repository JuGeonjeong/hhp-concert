import { Injectable } from '@nestjs/common';
import { QueueRepository } from '../domain/queue.repository';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
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

  async findAndUpdate(uuid: string): Promise<Queue> {
    const queue = await this.manager.findOne(Queue, { where: { uuid } });
    if (queue) {
      queue.status = QueueStatusEnum.OUT;
      return await this.manager.save(queue);
    }
    return null;
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
}
