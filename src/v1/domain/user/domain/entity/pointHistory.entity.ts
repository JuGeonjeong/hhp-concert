import { BaseEntities } from 'src/v1/common/typeorm/base.entity';
import { Column, Entity, JoinColumn } from 'typeorm';

@Entity({ name: 'pointHistory' })
export class PointHistory extends BaseEntities {
  @Column({ type: 'int', comment: '보유금' })
  amount: number;

  @Column('int')
  @JoinColumn({
    name: 'pointId',
    foreignKeyConstraintName: 'fk_seat_pointId',
  })
  pointId: number;

  constructor(partial: Partial<PointHistory>) {
    super();
    Object.assign(this, partial);
  }
}
