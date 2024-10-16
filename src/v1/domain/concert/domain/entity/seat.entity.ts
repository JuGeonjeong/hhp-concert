import { BaseEntities } from 'src/v1/common/typeorm/base.entity';
import { Column, Entity } from 'typeorm';

export enum SeatStatusEnum {
  // 좌석이 사용 가능함
  AVAILABLE = 'AVAILABLE',

  // 좌석 예약 요청 중
  RESERVED = 'RESERVED',

  // 좌석 예약이 확정됨
  CONFIRMED = 'CONFIRMED',
}

@Entity({ name: 'seat' })
export class Seat extends BaseEntities {
  @Column({ type: 'int', comment: '좌석번호' })
  seatNumber: number;

  @Column({ type: 'datetime', comment: '임시만료시간' })
  expiredAt: Date;

  @Column({ type: 'int', comment: '가격' })
  price: number;

  //   @IsEnum(AdjustmentStatusType)
  @Column({ type: 'enum', enum: SeatStatusEnum, default: 'AVAILABLE' })
  status: SeatStatusEnum;

  constructor(partial: Partial<Seat>) {
    super();
    Object.assign(this, partial);
  }
}
