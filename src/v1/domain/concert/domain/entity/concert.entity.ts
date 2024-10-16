import { BaseEntities } from 'src/v1/common/typeorm/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'concert' })
export class Concert extends BaseEntities {
  @Column({ comment: '이름' })
  name: string;

  constructor(partial: Partial<Concert>) {
    super();
    Object.assign(this, partial);
  }
}
