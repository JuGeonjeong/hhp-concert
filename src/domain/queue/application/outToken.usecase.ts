import { Inject } from '@nestjs/common';
import { QueueService } from './queue.service';
import Queue, { QueueStatusEnum } from '../domain/queue.entity';

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
