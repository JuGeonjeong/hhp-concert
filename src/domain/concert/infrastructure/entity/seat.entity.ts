import { Column, Entity, JoinColumn, VersionColumn } from 'typeorm';
import { BaseEntities } from '../../../../common/typeorm/base.entity';

export enum SeatStatusEnum {
  // 결제 가능함
  PENDING = 'PENDING',
  // 좌석 예약완료
  RESERVED = 'RESERVED',
  // 좌석 취소
  CANCEL = 'CANCEL',
}

@Entity({ name: 'seat' })
export default class SeatEntity extends BaseEntities {
  @Column({ type: 'int', comment: '좌석번호' })
  seatNumber: number;

  @Column({ type: 'datetime', comment: '임시만료시간' })
  expiredAt: Date;

  @Column({ type: 'int', comment: '가격', default: 1000 })
  price: number;

  //   @IsEnum(AdjustmentStatusType)
  @Column({ type: 'enum', enum: SeatStatusEnum, default: 'PENDING' })
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

  @VersionColumn() // 낙관적 락을 위한 버전 관리 컬럼
  version: number;

  // constructor(partial: Partial<Seat>) {
  //   super();
  //   Object.assign(this, partial);
  // }
}
