// import { BaseEntities } from 'src/v1/common/typeorm/base.entity';
import { Column, Entity } from 'typeorm';
import { BaseEntities } from '../../../../common/typeorm/base.entity';

@Entity({ name: 'user' })
export default class User extends BaseEntities {
  @Column({ comment: '이메일' })
  email: string;

  @Column({ comment: '대기열 uuid' })
  uuid: string;

  // constructor(partial: Partial<User>) {
  // Object.assign(this, partial);
  // }
}
