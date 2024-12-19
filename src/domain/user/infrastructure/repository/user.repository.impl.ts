import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { UserRepository } from '../../domain/repository/userRepository';
import { UserMapper } from '../mapper/user.mapper';
import { SeatReservDto } from 'src/domain/concert/interface/dto/req/seatReserv.dto';
import { User } from '../../domain/entity/user';
import UserEntity from '../entity/user.entity';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

  /**
   * @interface
   * @see {UserRepository.create}
   */
  async create(body: SeatReservDto): Promise<any> {
    // const entity = UserMapper.toEntity(body);
    // console.log(body);
    // const userEntity = await this.manager.save(entity);
    // return UserMapper.toDomain(userEntity);
  }

  /**
   * @interface
   * @see {UserRepository.findOne}
   */
  async findOne(id: number): Promise<User> {
    const entity = await this.manager.findOne(UserEntity, { where: { id } });
    return UserMapper.toDomain(entity);
  }
}
