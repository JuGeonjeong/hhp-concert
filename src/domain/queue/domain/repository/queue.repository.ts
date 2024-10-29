import Queue from '../entity/queue.entity';

export interface QueueRepository {
  create(): Promise<Queue>;
  findOne(uuid: string, status?: string): Promise<Queue>;
  findStatusEnter(): Promise<Queue>;
  waitingCount(): Promise<number>;
  update(queue: Queue, data: Partial<Queue>): Promise<Queue>;
  ghostQueue(): Promise<Queue[]>;
}
