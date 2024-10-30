import { sign } from 'jsonwebtoken';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { QueueRepository } from '../../domain/repository/queue.repository';
import { Queue } from '../../domain/entity/queue';
import { QueueStatusEnum } from '../../infrastructure/entity/queue.entity';
import { v4 as uuidv4 } from 'uuid';
// import { Cron, CronExpression } from '@nestjs/schedule';

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
    return await this.queueRepository.create(queue);
  }

  async createJwt(queue: Queue): Promise<string> {
    const { uuid, createdAt, activeAt } = queue;
    return sign(
      {
        uuid,
        createdAt,
        activeAt,
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

  async ghostQueue(): Promise<Queue[]> {
    return await this.queueRepository.ghostQueue();
  }

  // @Cron(CronExpression.EVERY_MINUTE)
  async joinQueue() {
    // 5명 제한
    // const maxJoiner = 5;
    // status.join -> 10분간 행동없으면 아웃
    const ghostJoiner = await this.ghostQueue();
    return ghostJoiner;
    // status.join 인원 확인
    // 대기열 오래된 순서부터 5 - join인원 = 입장수
    // status 변경
    // 입장시 유저테이블 생성
  }
}
