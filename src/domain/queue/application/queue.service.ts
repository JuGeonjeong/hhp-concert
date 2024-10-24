import { sign } from 'jsonwebtoken';
import { QueueRepository } from '../domain/queue.repository';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import Queue, { QueueStatusEnum } from '../domain/queue.entity';

@Injectable()
export class QueueService {
  constructor(
    @Inject('IQueueRepository')
    private readonly queueRepository: QueueRepository,
  ) {}

  async createQueue(): Promise<Queue> {
    return await this.queueRepository.create();
  }

  async createJwt(queue: Queue): Promise<string> {
    return sign(
      {
        uuid: queue.uuid,
        createdAt: queue.createdAt,
        enterdAt: queue.enteredAt,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: '1d',
        issuer: process.env.JWT_SECRET_KEY,
      },
    );
  }

  async findOne(uuid): Promise<Queue> {
    const queue = await this.queueRepository.findOne(uuid);
    if (queue) {
      if (queue.status === QueueStatusEnum.WAIT) {
        return queue;
      } else {
        throw new BadRequestException(`대기중이 아닙니다.`);
      }
    } else {
      throw new BadRequestException(`없는 대기열 데이터입니다.`);
    }
  }

  async update(queue: Queue, data: Partial<Queue>): Promise<Queue> {
    return await this.queueRepository.update(queue, data);
  }

  async findStatus(uuid) {
    const queue = await this.queueRepository.findOne(uuid);
    const status = queue.status;
    if (status === QueueStatusEnum.WAIT) {
      return queue;
    }
    if (status === QueueStatusEnum.ENTER) {
    }
    if (status === QueueStatusEnum.OUT) {
    }
  }

  async waitingCount() {
    return await this.queueRepository.waitingCount();
  }

  async findStatusEnter() {
    return await this.queueRepository.findStatusEnter();
  }

  async removeQueue(queue: Queue, data: Partial<Queue>): Promise<Queue> {
    return await this.queueRepository.update(queue, data);
  }
}
