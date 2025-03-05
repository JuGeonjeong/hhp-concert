import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { UserRepository } from '../../domain/repository/userRepository';
import { UserMapper } from '../mapper/user.mapper';
import { User } from '../../domain/entity/user';
import UserEntity from '../entity/user.entity';
import { CreateUserDto } from '../../interface/dto/req/createUser.dto';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(@InjectEntityManager() private readonly manager: EntityManager) {}
  /**
   * @interface
   * @see {UserRepository.create}
   */
  async create(body: CreateUserDto): Promise<any> {
    const domainUser = new User({
      id: null,
      name: body.name,
      email: body.email,
      uuid: body.uuid,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const entity = UserMapper.toEntity(domainUser);
    const userEntity = await this.manager.save(entity);
    return UserMapper.toDomain(userEntity);
  }
  /**
   * @interface
   * @see {UserRepository.findOne}
   */
  async findOne(id: number): Promise<User> {
    const entity = await this.manager.findOne(UserEntity, { where: { id } });
    return entity ? UserMapper.toDomain(entity) : null;
  }
  /**
   * @interface
   * @see {UserRepository.findOne}
   */
  async findByUuid(uuid: string): Promise<User> {
    const entity = await this.manager.findOne(UserEntity, { where: { uuid } });
    return entity ? UserMapper.toDomain(entity) : null;
  }
}
