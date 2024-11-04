import { User } from '../entity/user';

export interface UserRepository {
  create(body): Promise<User>;
  findOne(userId): Promise<User>;
}
