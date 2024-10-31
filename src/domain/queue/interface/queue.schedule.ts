import { Injectable } from '@nestjs/common';
import { QueueService } from '../application/service/queue.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class QueueScheduler {
  constructor(private readonly queueService: QueueService) {}

  @Cron('*/1 * * * *')
  async enterQueue() {
    await this.queueService.joinQueue();
  }
}
