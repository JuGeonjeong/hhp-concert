import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repository/userRepository';
import { NotFoundException404 } from 'src/common/exception/not.fount.exception.404';
import { User } from '../../domain/entity/user';
// import { ResourceNotFoundException } from 'src/common/exception/not.found.exception';

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async createUser(body): Promise<User> {
    return await this.userRepository.create(body);
  }

  async findOne(userId: number): Promise<User> {
    const data = await this.userRepository.findOne(userId);
    if (!data)
      throw new NotFoundException404(`없는 유저 입니다. id: ${userId}`);
    return data;
  }
}
