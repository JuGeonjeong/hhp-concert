import { BaseEntities } from 'src/v1/common/typeorm/base.entity';
import { Column } from 'typeorm';

export enum PaymentStatusEnum {
  // 예약신청
  REQUEST = 'REQUEST',
  // 예약완료
  CONFIRMED = 'CONFIRMED',
}

export class Payment extends BaseEntities {
  //   @IsEnum(AdjustmentStatusType)
  @Column({ type: 'enum', enum: PaymentStatusEnum, default: 'REQUEST' })
  status: PaymentStatusEnum;

  constructor(partial: Partial<Payment>) {
    super();
    Object.assign(this, partial);
  }
}
