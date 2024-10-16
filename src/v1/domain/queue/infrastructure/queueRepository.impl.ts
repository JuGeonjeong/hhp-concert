import { Injectable } from '@nestjs/common';
import { QueueRepository } from '../domain/queue.repository';
import { Queue, QueueStatusEnum } from '../domain/queue.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class QueueRepositoryImpl implements QueueRepository {
  constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

  async create(): Promise<Queue> {
    const queue = new Queue();
    queue.uuid = uuidv4();
    return await this.manager.save(queue);
  }

  async findOne(uuid: string): Promise<Queue> {
    return await this.manager.findOne(Queue, { where: { uuid } });
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
