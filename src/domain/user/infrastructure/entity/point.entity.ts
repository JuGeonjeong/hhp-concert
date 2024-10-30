import { Column, Entity, JoinColumn } from 'typeorm';
import { BaseEntities } from '../../../../common/typeorm/base.entity';

@Entity({ name: 'point' })
export default class PointEntity extends BaseEntities {
  @Column('int')
  amount: number;

  @Column('int')
  @JoinColumn({
    name: 'userId',
    foreignKeyConstraintName: 'fk_seat_userId',
  })
  userId: number;

  // constructor(partial: Partial<Point>) {
  //   super();
  //   Object.assign(this, partial);
  // }
}
