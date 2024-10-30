import { Inject } from '@nestjs/common';
import { QueueService } from '../service/queue.service';

export class CheckTokenUsecase {
  constructor(
    @Inject(QueueService)
    private readonly queueService: QueueService,
  ) {}

  async check(token) {
    // uuid로 queueT을 검증
    await this.queueService.findOne(token.uuid);
    const waitingCount = await this.queueService.waitingCount();

    // return: 대기인원, 대기시간
    return { waitingCount, waitingMin: waitingCount * 5 };
  }
}
