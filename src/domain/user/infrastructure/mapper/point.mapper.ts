import PointEntity from '../entity/point.entity';
import { Point } from '../../domain/entity/point';

export class PointMapper {
  static toDomain(entity: PointEntity): Point {
    return new Point({
      id: entity.id,
      userId: entity.userId,
      amount: entity.amount,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    });
  }

  static toEntity(domain: Point): PointEntity {
    const entity = new PointEntity();
    entity.id = domain.id;
    entity.userId = domain.userId;
    entity.amount = domain.amount;
    return entity;
  }
}
