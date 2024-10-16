import { BaseEntities } from 'src/v1/common/typeorm/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Point } from './point.entity';

@Entity({ name: 'pointHistory' })
export class PointHistory extends BaseEntities {
  @Column({ type: 'int', comment: '보유금' })
  amount: number;

  @ManyToOne(() => Point, (point) => point.pointHistory, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  point: Point;

  constructor(partial: Partial<PointHistory>) {
    super();
    Object.assign(this, partial);
  }
}
