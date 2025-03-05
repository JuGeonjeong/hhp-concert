import { QueueStatusEnum } from '../../infrastructure/entity/queue.entity';
export class Queue {
  readonly id: number;
  uuid: string;
  status: QueueStatusEnum;
  enteredAt: Date;
  expiredAt: Date;
  readonly createdAt: Date;
  private updatedAt: Date;
  private readonly deletedAt: Date;

  constructor(args: {
    id?: number;
    uuid: string;
    status?: QueueStatusEnum;
    enteredAt?: Date;
    expiredAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }) {
    this.id = args.id;
    this.uuid = args.uuid;
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

  createQueue(): void {
    this.status = QueueStatusEnum.ENTER;
    this.enteredAt = new Date();
    this.expiredAt = new Date(new Date().getTime() + 60 * 60 * 1000);
  }

  expire(): void {
    this.enteredAt = null;
    this.status = QueueStatusEnum.OUT;
  }
}
