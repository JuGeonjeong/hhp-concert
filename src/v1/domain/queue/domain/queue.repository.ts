import { Queue } from './queue.entity';

export interface QueueRepository {
  create(): Promise<Queue>;
  findOne(uuid: string, status?: string): Promise<Queue>;
  findStatusEnter(): Promise<Queue>;
  waitingCount(): Promise<number>;
  findAndUpdate(uuid: string): Promise<Queue>;
}
