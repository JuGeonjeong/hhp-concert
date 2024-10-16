import { CreateUserDto } from '../../interface/dto/req/createUser.dto';
import { User } from '../entity/user.entity';

export interface UserRepository {
  create(createUserDto: CreateUserDto): Promise<User>;
  save(user: User): Promise<User>;
  existsByEmail(email: string): Promise<boolean>;
}
