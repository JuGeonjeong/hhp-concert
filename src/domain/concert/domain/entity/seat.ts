import User from 'src/domain/user/domain/entity/user.entity';
import { Schedule } from './schedule';
import { SeatStatusEnum } from '../../infrastructure/entity/seat.entity';

export class Seat {
  id: number;
  scheduleId: number;
  userId: number;
  seatNumber: number;
  expiredAt: Date;
  price: number;
  status: SeatStatusEnum;
  isReserved: boolean;
  concertDate: Schedule;
  userInfo: User;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(args: {
    id?: number;
    scheduleId?: number;
    userId?: number;
    seatNumber: number;
    expiredAt: Date;
    price: number;
    status: SeatStatusEnum;
    isReserved: boolean;
    concertDate?: Schedule;
    userInfo?: User;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
  }) {
    this.id = args.id;
    this.scheduleId = args.scheduleId;
    this.userId = args.userId;
    this.concertDate = args.concertDate;
    this.expiredAt = args.expiredAt;
    this.userInfo = args.userInfo;
    this.seatNumber = args.seatNumber;
    this.status = args.status;
    this.price = args.price;
    this.isReserved = args.isReserved;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }

  reserve(): void {
    if (this.isReserved) {
      throw new Error('이미 예약된 좌석입니다.');
    }
    this.concertDate.reserveSeat();
    this.isReserved = true;
  }

  release(): void {
    this.concertDate.releaseSeat();
    this.isReserved = false;
  }
}
