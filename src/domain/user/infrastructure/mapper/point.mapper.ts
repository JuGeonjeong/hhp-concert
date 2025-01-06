import PointEntity from '../entity/point.entity';
import { Point } from '../../domain/entity/point';

export class PointMapper {
  static toDomain(entity: PointEntity): Point {
    return new Point({
      userId: entity.userId,
      amount: entity.amount,
    });
  }

  static toEntity(domain: Point): PointEntity {
    const entity = new PointEntity();
    entity.userId = domain.userId;
    entity.amount = domain.amount;
    return entity;
  }
}
