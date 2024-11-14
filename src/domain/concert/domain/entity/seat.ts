import { BadRequestException400 } from 'src/common/exception/bad.request.exception.400';
import { SeatStatusEnum } from '../../infrastructure/entity/seat.entity';
import { User } from 'src/domain/user/domain/entity/user';

export class Seat {
  id: number;
  scheduleId: number;
  userId: number;
  seatNumber: number;
  expiredAt: Date;
  price: number;
  status: SeatStatusEnum;
  isReserved: boolean;
  userInfo: User;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  add10ExpiredAt: any;

  constructor(args: {
    id?: number;
    scheduleId?: number;
    userId?: number;
    seatNumber: number;
    expiredAt: Date;
    price?: number;
    status?: SeatStatusEnum;
    isReserved?: boolean;
    userInfo?: User;
    version?: number;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  }) {
    this.id = args.id;
    this.scheduleId = args.scheduleId;
    this.userId = args.userId;
    this.expiredAt = args.expiredAt;
    this.userInfo = args.userInfo;
    this.seatNumber = args.seatNumber;
    this.status = args.status;
    this.price = args.price;
    this.isReserved = args.isReserved;
    this.version = args.version;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }

  // reserve(): void {
  //   if (this.isReserved) {
  //     throw new Error('이미 예약된 좌석입니다.');
  //   }
  //   this.concertDate.reserveSeat();
  //   this.isReserved = true;
  // }

  // release(): void {
  //   this.concertDate.releaseSeat();
  //   this.isReserved = false;
  // }
  static availablePayment(request): void {
    if (request.status === 'CANCEL' || request.status === 'RESERVED')
      throw new BadRequestException400(
        '시간초과 혹은 결제 불가능 상태입니다. ',
      );
  }

  static add29ExpiredAt(expiredAt): Date {
    return new Date(new Date(expiredAt).getTime() + 29 * 60 * 1000);
  }
}
