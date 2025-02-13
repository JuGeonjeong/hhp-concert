import { sign } from 'jsonwebtoken';
import { Inject, Injectable } from '@nestjs/common';
import { QueueRepository } from '../repository/queue.repository';
import { Queue } from '../entity/queue';
import { QueueStatusEnum } from '../../infrastructure/entity/queue.entity';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException400 } from 'src/common/exception/bad.request.exception.400';
import { RedisService } from '../../../../common/redis/redis.service';

@Injectable()
export class QueueService {
  constructor(
    @Inject('IQueueRepository')
    private readonly queueRepository: QueueRepository,
    private readonly redisService: RedisService,
  ) {}

  async enterQueue(uuid: string): Promise<void> {
    const queue = new Queue({
      uuid,
    });
    queue.createQueue();
    await this.queueRepository.create(queue);
  }

  async createQueue(): Promise<any> {
    const uuid = uuidv4();
    const createdAt = new Date();
    /** redis 대기열 추가 */
    await this.redisService.getClient().rPush('concert_queue', uuid);

    return { uuid, createdAt };
  }

  async createJwt(queue: any): Promise<string> {
    const { id, uuid } = queue;
    console.log('queue', queue.uuid);
    return sign(
      {
        id,
        uuid,
        createdAt: new Date(),
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: '1d',
        issuer: process.env.JWT_SECRET_KEY,
      },
    );
  }

  async findOne(uuid: string): Promise<Queue> {
    const queue = await this.queueRepository.findOne(uuid);
    if (queue) {
      if (queue.status === QueueStatusEnum.WAIT) {
        return queue;
      } else {
        throw new BadRequestException400(`대기중이 아닙니다.`);
      }
    } else {
      throw new BadRequestException400(`없는 대기열 데이터입니다.`);
    }
  }

  async update(queue: Queue, data: Partial<Queue>): Promise<Queue> {
    return await this.queueRepository.update(queue, data);
  }

  async waitingCount(): Promise<any> {
    return await this.queueRepository.waitingCount();
  }

  async expiredQueue(): Promise<Queue[]> {
    return await this.queueRepository.findExpiredQueues();
  }
}
