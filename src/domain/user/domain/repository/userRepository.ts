import { User } from '../entity/user';

export interface UserRepository {
  create(body: any): Promise<User>;
  findOne(userId: number): Promise<User>;
}
