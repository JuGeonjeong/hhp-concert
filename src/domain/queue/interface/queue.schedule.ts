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

  /** 1분마다 대기열 입장 (ZSET → ENTER 상태) */
  @Cron('*/1 * * * *')
  async joinQueue() {
    const redis = this.redisService.getClient();
    const now = Date.now();
    const expiredAt = now + 60 * 1000;

    // 처음 10명 조회
    const queue = await redis.zRange('sorted_concert_queue', 0, 9);
    console.log('🎯 현재 대기열 (조회된 10개):', queue);

    if (queue.length > 0) {
      // Pipeline을 사용하여 상태 변경 + 만료 시간 설정
      const pipeline = redis.multi();
      queue.forEach((uuid) => {
        pipeline.hSet(`queue_data:${uuid}`, {
          status: 'ENTER',
          expiredAt: new Date(expiredAt).toISOString(),
        });
      });
      await pipeline.exec();
    }

    await this.cleanExpiredUsers();
  }

  /** 1분마다 만료된 유저 삭제 */
  @Cron('*/1 * * * *')
  async cleanExpiredUsers() {
    const redis = this.redisService.getClient();
    const now = Date.now();

    // `ZSET`에서 만료 시간이 지난 데이터 가져오기 (전체 조회)
    const expiredUuids = await redis.zRangeByScore(
      'sorted_concert_queue',
      0,
      now,
    );
    if (expiredUuids.length === 0) {
      console.log('⏳ 만료된 유저 없음');
      return;
    }

    // `status = ENTER`인 데이터만 필터링 (Redis Pipeline 사용)
    const pipeline = redis.multi();
    const uuidsToDelete: string[] = [];

    for (const uuid of expiredUuids) {
      const status = await redis.hGet(`queue_data:${uuid}`, 'status');
      if (status === 'ENTER') {
        uuidsToDelete.push(uuid);
        pipeline.del(`queue_data:${uuid}`);
      }
    }

    if (uuidsToDelete.length > 0) {
      pipeline.zRem(
        'sorted_concert_queue',
        uuidsToDelete as [string, ...string[]],
      );
      await pipeline.exec();
    }

    // 현재 대기열 확인
    const queue = await redis.zRangeWithScores('sorted_concert_queue', 0, -1);
    console.log('🚀 현재 대기열:', `(${queue.length} 명)`);
  }
}
