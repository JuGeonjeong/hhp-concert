import { sign } from 'jsonwebtoken';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { QueueRepository } from '../../domain/repository/queue.repository';
import { Queue } from '../../domain/entity/queue';
import { QueueStatusEnum } from '../../infrastructure/entity/queue.entity';
import { Cron } from '@nestjs/schedule';
import { v4 as uuidv4 } from 'uuid';
import { UserRepository } from 'src/domain/user/domain/repository/userRepository';
// import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class QueueService {
  constructor(
    @Inject('IQueueRepository')
    private readonly queueRepository: QueueRepository,
    @Inject('IUserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async createQueue(): Promise<Queue> {
    const queue = new Queue({
      uuid: uuidv4(),
      status: QueueStatusEnum.WAIT,
    });
    const result = await this.queueRepository.create(queue);
    console.log(result.uuid);
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

  async findOne(uuid): Promise<Queue> {
    const queue = await this.queueRepository.findOne(uuid);
    console.log(queue);
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

  async ghostQueue(): Promise<Queue[]> {
    return await this.queueRepository.ghostQueue();
  }

  @Cron('*/1 * * * *')
  async joinQueue() {
    const waitingQueues = await this.queueRepository.getWaitingQueue();
    waitingQueues.forEach(async (queue) => {
      queue.activate();
      await this.userRepository.create({ uuid: queue.uuid });
    });
    await this.queueRepository.updateQueues(waitingQueues);
  }

  @Cron('*/1 * * * *')
  async expireQueue() {
    const expiredQueues = await this.queueRepository.findExpiredQueues();
    expiredQueues.forEach((queue) => queue.expire());

    await this.queueRepository.updateQueues(expiredQueues);
  }
}
