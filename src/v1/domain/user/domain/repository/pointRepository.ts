import Point from '../entity/point.entity';
import User from '../entity/user.entity';

export interface PointRepository {
  charge(userId: number, point: number, user: User): Promise<Point>;
  findOne(userId: number): Promise<Point>;
  usePoint(point: Point, calcPoint): Promise<Point>;
}
