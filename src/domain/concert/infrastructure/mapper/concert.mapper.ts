import { Concert } from '../../domain/entity/concert';
import ConcertEntity from '../entity/concert.typeorm.entity';

export class ConcertMapper {
  static toDomain(entity: ConcertEntity): Concert {
    return new Concert({
      id: entity.id,
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    });
  }

  static toEntity(concert: Concert): ConcertEntity {
    const entity = new ConcertEntity();
    entity.id = concert.id;
    entity.name = concert.name;
    return entity;
  }
}
