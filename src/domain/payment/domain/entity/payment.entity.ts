// import { BaseEntities } from 'src/v1/common/typeorm/base.entity';
import { Column, JoinColumn } from 'typeorm';
import { BaseEntities } from '../../../../common/typeorm/base.entity';

export default class Payment extends BaseEntities {
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

  @Column()
  status: string;

  // constructor(partial: Partial<Payment>) {
  //   super();
  //   Object.assign(this, partial);
  // }
}
