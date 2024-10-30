import { User } from '../../domain/entity/user';
import UserEntity from '../entity/user.entity';

export class UserMapper {
  static toDomain(entity: UserEntity): User {
    return new User({
      id: entity.id,
      uuid: entity.uuid,
      email: entity.email,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    });
  }

  static toEntity(domain: User): UserEntity {
    const entity = new UserEntity();
    entity.id = domain.id;
    entity.uuid = domain.uuid;
    entity.email = domain.email;
    return entity;
  }
}
