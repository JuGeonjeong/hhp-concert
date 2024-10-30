import { v4 as uuidv4 } from 'uuid';
import { QueueStatusEnum } from '../../infrastructure/entity/queue.entity';
export class Queue {
  id: number;
  uuid: string;
  status: QueueStatusEnum;
  activeAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(args: {
    id?: number;
    uuid?: string;
    status?: QueueStatusEnum;
    activeAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }) {
    this.id = args.id;
    this.uuid = uuidv4();
    this.status = args.status;
    this.activeAt = args.activeAt;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }
}
