import { Queue } from '../entity/queue';

export interface QueueRepository {
  create(queue: Queue): Promise<Queue>;
  findOne(uuid: string, status?: string): Promise<Queue>;
  findStatusEnter(): Promise<Queue>;
  waitingCount(): Promise<number>;
  update(queue: Queue, data: Partial<Queue>): Promise<Queue>;
  ghostQueue(): Promise<Queue[]>;
  getWaitingQueue(): Promise<Queue[]>;
  findExpiredQueues(): Promise<Queue[]>;
  updateQueues(queue: Queue[]): Promise<void>;
}
