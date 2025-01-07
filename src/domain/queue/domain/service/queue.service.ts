import { sign } from 'jsonwebtoken';
import { Inject, Injectable } from '@nestjs/common';
import { QueueRepository } from '../repository/queue.repository';
import { Queue } from '../entity/queue';
import { QueueStatusEnum } from '../../infrastructure/entity/queue.entity';
import { Cron } from '@nestjs/schedule';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException400 } from 'src/common/exception/bad.request.exception.400';

@Injectable()
export class QueueService {
  constructor(
    @Inject('IQueueRepository')
    private readonly queueRepository: QueueRepository,
  ) {}

  async createQueue(): Promise<Queue> {
    const queue = new Queue({
      uuid: uuidv4(),
      status: QueueStatusEnum.WAIT,
    });
    const result = await this.queueRepository.create(queue);
    return result;
  }

  async createJwt(queue: Queue): Promise<string> {
    const { id, uuid, createdAt } = queue;
    console.log('queue', queue);
    return sign(
      {
        id,
        uuid,
        createdAt,
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

  async waitingCount() {
    return await this.queueRepository.waitingCount();
  }

  // 1분마다 상태를 입장으로 바꿈
  @Cron('*/1 * * * *')
  async joinQueue() {
    // const limit = 5;
    // const waitingQueues = await this.queueRepository.getWaitingQueue(limit);
    // waitingQueues.forEach(async (queue) => {
    //   queue.activate();
    //   await this.userRepository.create({ uuid: queue.uuid });
    // });
    // await this.queueRepository.updateQueues(waitingQueues);
  }

  // 1분마다 상태를 만료로 바꿈
  @Cron('*/1 * * * *')
  async expireQueue() {
    // const expiredQueues = await this.queueRepository.findExpiredQueues();
    // expiredQueues.forEach((queue) => queue.expire());
    // await this.queueRepository.updateQueues(expiredQueues);
  }
}
