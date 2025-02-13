import { Inject } from '@nestjs/common';
import { QueueService } from '../../domain/service/queue.service';
import { Queue } from '../../domain/entity/queue';
import { RedisService } from '../../../../common/redis/redis.service';

export class CreateTokenUsecase {
  constructor(
    @Inject(QueueService)
    private readonly queueService: QueueService,
    private readonly redisService: RedisService,
  ) {}

  async create(): Promise<{ queue: Queue; token: string; expiryDate: Date }> {
    const queue = await this.queueService.createQueue();
    const token = await this.queueService.createJwt(queue);
    const expiryDate = new Date(Date.now() + 60 * 60 * 1000 * 24 * 2);

    return { queue, token, expiryDate };
  }
}
