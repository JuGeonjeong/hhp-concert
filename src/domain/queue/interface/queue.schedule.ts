import { Injectable } from '@nestjs/common';
import { RedisService } from '../../../common/redis/redis.service';
import { Cron } from '@nestjs/schedule';
import { QueueService } from '../domain/service/queue.service';
import { QueueStatusEnum } from '../infrastructure/entity/queue.entity';

@Injectable()
export class QueueScheduler {
  constructor(
    private readonly redisService: RedisService,
    private readonly queueService: QueueService,
  ) {}

  /** 1분마다 대기열 입장 */
  @Cron('*/1 * * * *')
  async joinQueue() {
    const redis = this.redisService.getClient();

    /** 1) 처음 10개 조회 (삭제하지 않음) */
    const queue = await redis.lRange('concert_queue', 0, 9);
    console.log('🎯 현재 대기열 (조회된 10개):', queue);

    /** 2) 조회된 데이터 삭제 & MySQL 저장 */
    for (const item of queue) {
      await redis.lPop('concert_queue');
      await this.queueService.enterQueue(item);
    }
    console.log('🚀 10개 삭제 & MySQL 저장 완료');
  }

  /** 1분마다 대기열 만료 */
  @Cron('*/1 * * * *')
  async quitQueue() {
    const queue = await this.queueService.expiredQueue();
    for (const item of queue) {
      await this.queueService.update(item, {
        ...item,
        status: QueueStatusEnum.OUT,
      });
    }
  }
}
