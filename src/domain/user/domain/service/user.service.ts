import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repository/userRepository';
import { User } from '../../domain/entity/user';
// import { NotFoundException404 } from 'src/common/exception/not.found.exception.404';
import { NotFoundException404 } from '../../../../common/exception/not.found.exception.404';

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async createUser(body: any): Promise<User> {
    return await this.userRepository.create(body);
  }

  async findOne(userId: number): Promise<User> {
    const user = await this.userRepository.findOne(userId);
    if (!user)
      throw new NotFoundException404(`없는 유저 입니다. id: ${userId}`);
    return user;
  }
}
