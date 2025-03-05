import { Inject } from '@nestjs/common';
import { QueueService } from '../../domain/service/queue.service';
import { RedisService } from '../../../../common/redis/redis.service';
import { BadRequestException400 } from 'src/common/exception/bad.request.exception.400';

export class CheckTokenUsecase {
  constructor(
    @Inject(QueueService)
    private readonly queueService: QueueService,
    private readonly redisService: RedisService,
  ) {}

  async check(token: any) {
    const redis = this.redisService.getClient();
    const queue = await redis.lRange('concert_queue', 0, -1);
    const index = queue.indexOf(token.uuid);
    if (index < 1) {
      throw new BadRequestException400(`대기중이 아닙니다.`);
    }

    return {
      uuid: token.uuid,
      waitingCount: index,
      waitingMin: index * 2,
    };
  }
}
