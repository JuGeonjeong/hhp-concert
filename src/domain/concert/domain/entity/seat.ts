import User from 'src/domain/user/domain/entity/user.entity';
import { SeatStatusEnum } from '../../infrastructure/entity/seat.typeorm.entity';
import { Schedule } from './schedule';

export class Seat {
  id: number;
  seatNumber: number;
  expiredAt: Date;
  price: number;
  status: SeatStatusEnum;
  isReserved: boolean;
  concertDate: Schedule;
  userInfo: User;

  constructor(args: {
    id?: number;
    seatNumber: number;
    expiredAt: Date;
    price: number;
    status: SeatStatusEnum;
    isReserved: boolean;
    concertDate?: Schedule;
    userInfo?: User;
  }) {
    this.id = args.id;
    this.concertDate = args.concertDate;
    this.expiredAt = args.expiredAt;
    this.userInfo = args.userInfo;
    this.seatNumber = args.seatNumber;
    this.status = args.status;
    this.price = args.price;
    this.isReserved = args.isReserved;
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
