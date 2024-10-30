import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import User from '../domain/entity/user.entity';
import { UserRepository } from '../domain/repository/userRepository';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

  async create(body): Promise<User> {
    const user = this.manager.create(User, body);
    return await this.manager.save(user);
  }

  async findOne(id): Promise<User> {
    return await this.manager.findOne(User, { where: { id } });
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.manager.findOne(User, { where: { email } });
    return !!user;
  }
}
