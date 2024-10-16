import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../interface/dto/req/createUser.dto';
import { User } from '../../domain/entity/user.entity';
import { UserRepository } from '../../domain/repository/userRepository';

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = await this.userRepository.create(createUserDto);
    return await this.userRepository.save(newUser);
  }

  async isEmailTaken(email: string): Promise<boolean> {
    return await this.userRepository.existsByEmail(email);
  }
}
