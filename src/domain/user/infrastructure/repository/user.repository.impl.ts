import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { UserRepository } from '../../domain/repository/userRepository';
import { User } from '../../domain/entity/user';
import { UserMapper } from '../mapper/user.mapper';
import { SeatReservDto } from 'src/domain/concert/interface/dto/req/seatReserv.dto';

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
    const entity = await this.manager.findOne(User, { where: { id } });
    return UserMapper.toDomain(entity);
  }
}
