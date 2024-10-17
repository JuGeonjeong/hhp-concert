import { BaseEntities } from 'src/v1/common/typeorm/base.entity';
import { Column, Entity, JoinColumn } from 'typeorm';

@Entity({ name: 'point' })
export default class Point extends BaseEntities {
  @Column('int')
  amount: number;

  @Column('int')
  @JoinColumn({
    name: 'userId',
    foreignKeyConstraintName: 'fk_seat_userId',
  })
  userId: number;

  constructor(partial: Partial<Point>) {
    super();
    Object.assign(this, partial);
  }
}
