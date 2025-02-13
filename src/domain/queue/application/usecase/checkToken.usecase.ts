import { Inject } from '@nestjs/common';
import { QueueService } from '../../domain/service/queue.service';
import { RedisService } from '../../infrastructure/redis/redis.service';

export class CheckTokenUsecase {
  constructor(
    @Inject(QueueService)
    private readonly queueService: QueueService,
    private readonly redisService: RedisService,
  ) {}

  async check(token: any) {
    await this.queueService.findOne(token.uuid);
    const waitingCount = await this.queueService.waitingCount();
    const queue = await this.redisService
      .getClient()
      .lRange('concert_queue', 0, -1);

    console.log('🎯 현재 대기열:', queue); // 콘솔에 출력
    return {
      uuid: token.uuid,
      waitingCount,
      waitingMin: waitingCount * 2,
    };
  }
}
