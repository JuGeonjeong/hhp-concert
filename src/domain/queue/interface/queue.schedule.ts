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
    const expiredAt = new Date(Date.now() + 60 * 1000).toISOString();

    /** 1) 처음 10개 조회 (삭제하지 않음) */
    const queue = await redis.lRange('concert_queue', 0, 9);
    console.log('🎯 현재 대기열 (조회된 10개):', queue);

    // /** 2) 조회된 데이터 만료시간,상태값 지정 */
    for (const item of queue) {
      await redis.hSet(`queue_data:${item}`, {
        status: 'ENTER',
        expiredAt: expiredAt,
      });
    }

    /** 1) 전체 조회 */
    const queueAll = await redis.lRange('concert_queue', 0, -1);
    console.log('🚀 현재 대기열', queueAll);

    for (const uuid of queueAll) {
      const queueData = await redis.hGetAll(`queue_data:${uuid}`); // ✅ 모든 필드 조회
      const expiredAt = new Date(queueData.expiredAt).getTime();
      const status = queueData.status; // ✅ status 값 추가
      const nowAt = Date.now();

      console.log(
        `📌 UUID: ${uuid}, 상태: ${status}, 만료시간: ${new Date(expiredAt)}`,
      );

      if (expiredAt < nowAt && status === 'ENTER') {
        // ✅ 상태 조건 추가
        await redis.lRem('concert_queue', 1, uuid);
        await redis.del(`queue_data:${uuid}`);
        console.log(`❌ 삭제 완료: ${uuid}`);
      }
    }
  }
}
