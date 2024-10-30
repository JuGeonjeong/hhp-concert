import { Inject } from '@nestjs/common';
import { QueueService } from '../service/queue.service';
import { Queue } from '../../domain/entity/queue';

export class CreateTokenUsecase {
  constructor(
    @Inject(QueueService)
    private readonly queueService: QueueService,
  ) {}

  async create(): Promise<{ queue: Queue; token: string; expiryDate: Date }> {
    const queue = await this.queueService.createQueue();
    const token = await this.queueService.createJwt(queue);
    const expiryDate = new Date(Date.now() + 60 * 60 * 1000 * 24 * 2);
    console.log(token);
    return { queue, token, expiryDate };
  }
}
