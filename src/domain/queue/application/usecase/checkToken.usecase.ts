import { Inject } from '@nestjs/common';
import { QueueService } from '../service/queue.service';

export class CheckTokenUsecase {
  constructor(
    @Inject(QueueService)
    private readonly queueService: QueueService,
  ) {}

  async check(token: any) {
    await this.queueService.findOne(token.uuid);
    const waitingCount = await this.queueService.waitingCount();
    return {
      uuid: token.uuid,
      waitingCount,
      waitingMin: waitingCount * 2,
    };
  }
}
