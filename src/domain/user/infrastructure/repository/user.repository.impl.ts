import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { UserRepository } from '../../domain/repository/userRepository';
import { User } from '../../domain/entity/user';
import { UserMapper } from '../mapper/user.mapper';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

  async create(body): Promise<User> {
    const entity = UserMapper.toEntity(body);
    const userEntity = await this.manager.save(entity);
    return UserMapper.toDomain(userEntity);
  }

  async findOne(id): Promise<User> {
    const entity = await this.manager.findOne(User, { where: { id } });
    return UserMapper.toDomain(entity);
  }
}
