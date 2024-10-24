import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import User from '../../domain/entity/user.entity';
import { UserRepository } from '../../domain/repository/userRepository';

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async createUser(body): Promise<User> {
    return await this.userRepository.create(body);
  }

  async findOne(userId): Promise<User> {
    const data = await this.userRepository.findOne(userId);
    if (!data) {
      throw new BadRequestException(`없는 유저 입니다. id: ${userId}`);
    }
    return data;
  }

  async isEmailTaken(email: string): Promise<boolean> {
    return await this.userRepository.existsByEmail(email);
  }
}
