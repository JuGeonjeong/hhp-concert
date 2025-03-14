import { Inject } from '@nestjs/common';
import { QueueService } from '../../domain/service/queue.service';
import { Queue } from '../../domain/entity/queue';
import { QueueStatusEnum } from '../../infrastructure/entity/queue.entity';

export class OutTokenUsecase {
  constructor(
    @Inject(QueueService)
    private readonly queueService: QueueService,
  ) {}

  async update(token: Queue): Promise<Queue> {
    const { uuid } = token;
    const queue = await this.queueService.findOne(uuid);
    return await this.queueService.update(queue, {
      status: QueueStatusEnum.OUT,
    });
  }
}
