import { Injectable } from '@nestjs/common';
import { RedisService } from '../../../common/redis/redis.service';
import { Cron } from '@nestjs/schedule';
import { QueueService } from '../domain/service/queue.service';

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
    const now = Date.now();
    const expiredAt = now + 60 * 1000; // 1분 후 만료

    /** 처음 10개 조회 */
    const queue = await redis.lRange('concert_queue', 0, 9);
    if (queue.length > 0) {
      /** Redis Pipeline을 사용하여 `Sorted Set`에 한 번에 추가 */
      const pipeline = redis.multi();
      queue.forEach((item) => {
        pipeline.zAdd('sorted_concert_queue', {
          score: expiredAt,
          value: item,
        });
      });
      await pipeline.exec();
    }

    /** 만료된 유저 삭제 */
    await this.cleanExpiredUsers();
  }

  /** 1분마다 만료된 유저 삭제 */
  @Cron('*/1 * * * *')
  async cleanExpiredUsers() {
    const redis = this.redisService.getClient();
    const now = Date.now();

    // 만료된 유저 조회
    const expiredUsers = await redis.zRangeByScore(
      'sorted_concert_queue',
      0,
      now,
    );
    if (expiredUsers.length === 0) {
      console.log('⏳ 만료된 유저 없음');
      return;
    }

    // Redis Pipeline을 사용하여 삭제 최적화
    const pipeline = redis.multi();
    // ZSET에서 삭제
    pipeline.zRemRangeByScore('sorted_concert_queue', 0, now);
    // List에서도 삭제
    expiredUsers.forEach((uuid) => {
      pipeline.lRem('concert_queue', 1, uuid);
    });

    await pipeline.exec();

    // 현재 대기열 확인
    const queue = await redis.lRange('concert_queue', 0, -1);
    console.log('🚀 현재 대기열 (List 확인):', `(${queue.length} 명)`);
  }
}
