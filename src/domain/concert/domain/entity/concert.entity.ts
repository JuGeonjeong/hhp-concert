import { Column, Entity } from 'typeorm';
import { BaseEntities } from '../../../../common/typeorm/base.entity';

@Entity({ name: 'concert' })
export default class Concert extends BaseEntities {
  @Column({ comment: '이름' })
  name: string;

  // @ApiHideProperty()
  // @OneToMany(() => Schedule, (schedule) => schedule.concert)
  // schedules: Schedule[];

  // constructor(partial: Partial<Concert>) {
  //   super();
  //   Object.assign(this, partial);
  // }
}
