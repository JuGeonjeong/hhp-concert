import PointEntity from '../entity/point.entity';
import { Point } from '../../domain/entity/point';

export class PointMapper {
  static toDomain(entity: PointEntity): Point {
    return new Point({
      userId: entity.userId,
      point: entity.point,
    });
  }

  static toEntity(domain: Point): PointEntity {
    const entity = new PointEntity();
    entity.userId = domain.userId;
    entity.point = domain.point;
    return entity;
  }
}
