import { User } from '../../domain/entity/user';
import UserEntity from '../entity/user.entity';

export class UserMapper {
  // Infrastructure(UserEntity) → Domain(User)
  static toDomain(entity: Partial<UserEntity>): User {
    return new User({
      id: entity.id,
      name: entity.name,
      email: entity.email,
      uuid: entity.uuid,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  // Domain(User) → Infrastructure(UserEntity)
  static toEntity(domain: Partial<User>): UserEntity {
    const entity = new UserEntity();
    entity.id = domain.getId();
    entity.name = domain.getName();
    entity.email = domain.getEmail();
    entity.uuid = domain.getUuid();
    return entity;
  }
}
