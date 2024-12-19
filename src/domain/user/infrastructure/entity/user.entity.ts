import { Column, Entity } from 'typeorm';
import { BaseEntities } from '../../../../common/typeorm/base.entity';

@Entity({ name: 'user' })
export default class UserEntity extends BaseEntities {
  @Column({ type: String, comment: '이름' })
  name: string;

  @Column({ type: String, comment: '이메일' })
  email: string;

  @Column({ type: String, comment: '대기열 uuid', nullable: true })
  uuid: string;

  // constructor(partial: Partial<User>) {
  // Object.assign(this, partial);
  // }
}
