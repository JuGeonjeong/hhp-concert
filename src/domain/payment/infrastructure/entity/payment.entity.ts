import { Column, JoinColumn } from 'typeorm';
import { BaseEntities } from '../../../../common/typeorm/base.entity';

export enum PaymentStatusEnum {
  // 결제 전
  WAIT = '결제 대기',
  // 결제 후
  SUCCESS = '결제 완료',
}

export default class PaymentEntity extends BaseEntities {
  @Column('int')
  @JoinColumn({
    name: 'userId',
    foreignKeyConstraintName: 'fk_seat_userId',
  })
  userId: number;

  @Column('int')
  @JoinColumn({
    name: 'seatId',
    foreignKeyConstraintName: 'fk_seat_seatId',
  })
  seatId: number;

  @Column({ enum: PaymentStatusEnum })
  status: PaymentStatusEnum;

  @Column()
  orderKey: string;

  @Column()
  amount: number;

  // constructor(partial: Partial<Payment>) {
  //   super();
  //   Object.assign(this, partial);
  // }
}
