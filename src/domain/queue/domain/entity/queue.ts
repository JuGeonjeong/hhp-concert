import { v4 as uuidv4 } from 'uuid';
import { QueueStatusEnum } from '../../infrastructure/entity/queue.entity';
export class Queue {
  id: number;
  uuid: string;
  status: QueueStatusEnum;
  enteredAt: Date;
  expiredAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(args: {
    id?: number;
    uuid?: string;
    status?: QueueStatusEnum;
    enteredAt?: Date;
    expiredAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }) {
    this.id = args.id;
    this.uuid = uuidv4();
    this.status = args.status;
    this.enteredAt = args.enteredAt;
    this.expiredAt = args.enteredAt;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }

  activate(): void {
    if (this.status === QueueStatusEnum.WAIT) {
      this.status = QueueStatusEnum.ENTER;
      // 활성화 후 5분 동안 유효
      this.expiredAt = new Date(new Date().getTime() + 5 * 60 * 1000);
      this.enteredAt = new Date(new Date().getTime());
    }
  }

  expire(): void {
    this.enteredAt = null;
    this.status = QueueStatusEnum.OUT;
  }
}
