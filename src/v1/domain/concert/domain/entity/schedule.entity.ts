// import { BaseEntities } from 'src/v1/common/typeorm/base.entity';
import { Column, Entity, JoinColumn } from 'typeorm';
import { BaseEntities } from '../../../../common/typeorm/base.entity';

@Entity({ name: 'schedule' })
export default class Schedule extends BaseEntities {
  @Column({ type: 'datetime', comment: '일자' })
  date: Date;

  @Column({ type: 'int', comment: '최대인원', default: 50 })
  maximum: number;

  @Column({ type: 'int', comment: '현재인원', default: 0 })
  count: number;

  @Column('int')
  @JoinColumn({
    name: 'concertId',
    foreignKeyConstraintName: 'fk_performance_concertId',
  })
  concertId: number;

  // constructor(partial: Partial<Schedule>) {
  //   super();
  //   Object.assign(this, partial);
  // }
}
