import { Queue } from '../entity/queue';

export interface QueueRepository {
  create(queue: any): Promise<Queue>;
  findOne(uuid: string, status?: string): Promise<Queue>;
  waitingCount(): Promise<number>;
  update(queue: Queue, data: Partial<Queue>): Promise<Queue>;
  getWaitingQueue(limit: number): Promise<Queue[]>;
  findExpiredQueues(): Promise<Queue[]>;
  updateQueues(queue: Queue[]): Promise<void>;
}
