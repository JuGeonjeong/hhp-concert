import { BaseEntities } from 'src/v1/common/typeorm/base.entity';
import { Column, Entity, JoinColumn } from 'typeorm';

export enum SeatStatusEnum {
  // 결제 가능함
  AVAILABLE = 'AVAILABLE',
  // 좌석 예약완료
  RESERVED = 'RESERVED',
  // 좌석 예약완료
  CANCEL = 'CANCEL',
}

@Entity({ name: 'seat' })
export default class Seat extends BaseEntities {
  @Column({ type: 'int', comment: '좌석번호' })
  seatNumber: number;

  @Column({ type: 'datetime', comment: '임시만료시간' })
  expiredAt: Date;

  @Column({ type: 'int', comment: '가격', default: 1000 })
  price: number;

  //   @IsEnum(AdjustmentStatusType)
  @Column({ type: 'enum', enum: SeatStatusEnum, default: 'AVAILABLE' })
  status: SeatStatusEnum;

  @Column('int')
  @JoinColumn({
    name: 'scheduleId',
    foreignKeyConstraintName: 'fk_seat_scheduleId',
  })
  scheduleId: number;

  @Column('int')
  @JoinColumn({
    name: 'userId',
    foreignKeyConstraintName: 'fk_seat_userId',
  })
  userId: number;

  constructor(partial: Partial<Seat>) {
    super();
    Object.assign(this, partial);
  }
}
