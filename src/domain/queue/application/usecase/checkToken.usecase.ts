import { Inject } from '@nestjs/common';
import { QueueService } from '../service/queue.service';

export class CheckTokenUsecase {
  constructor(
    @Inject(QueueService)
    private readonly queueService: QueueService,
  ) {}

  async check(token) {
    await this.queueService.findOne(token.uuid);
    const waitingCount = await this.queueService.waitingCount();
    const data = { waitingCount, waitingMin: waitingCount * 2 };
    return data;
  }
}
