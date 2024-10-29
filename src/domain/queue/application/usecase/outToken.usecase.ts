import { Inject } from '@nestjs/common';
import Queue, { QueueStatusEnum } from '../../domain/entity/queue.entity';
import { QueueService } from '../../domain/service/queue.service';

export class OutTokenUsecase {
  constructor(
    @Inject(QueueService)
    private readonly queueService: QueueService,
  ) {}

  async update(token: Queue): Promise<Queue> {
    const { uuid } = token;
    const queue = await this.queueService.findOne(uuid);
    const update = await this.queueService.update(queue, {
      status: QueueStatusEnum.OUT,
    });
    return update;
  }
}
