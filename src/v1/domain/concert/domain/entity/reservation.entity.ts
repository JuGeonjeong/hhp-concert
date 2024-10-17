import { BaseEntities } from 'src/v1/common/typeorm/base.entity';
import { Column, Entity } from 'typeorm';

export enum ReservationStatusEnum {
  // 예약신청
  REQUEST = 'REQUEST',
  // 예약완료
  CONFIRMED = 'CONFIRMED',
}

@Entity({ name: 'reservation' })
export default class Reservation extends BaseEntities {
  //   @IsEnum(AdjustmentStatusType)
  @Column({ type: 'enum', enum: ReservationStatusEnum, default: 'REQUEST' })
  status: ReservationStatusEnum;

  constructor(partial: Partial<Reservation>) {
    super();
    Object.assign(this, partial);
  }
}
