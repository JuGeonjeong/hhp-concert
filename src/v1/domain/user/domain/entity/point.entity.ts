import { BaseEntities } from 'src/v1/common/typeorm/base.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { PointHistory } from './pointHistory.entity';

@Entity({ name: 'point' })
export class Point extends BaseEntities {
  @Column('int')
  amount: number;

  @OneToOne(() => Point, (point) => point.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @OneToMany(() => PointHistory, (pointHistory) => pointHistory.point, {
    cascade: true,
  })
  pointHistory: PointHistory[];

  constructor(partial: Partial<Point>) {
    super();
    Object.assign(this, partial);
  }
}
