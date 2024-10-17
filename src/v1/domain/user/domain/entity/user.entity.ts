import { BaseEntities } from 'src/v1/common/typeorm/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'user' })
export default class User extends BaseEntities {
  @Column({ comment: '이메일' })
  email: string;

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}
