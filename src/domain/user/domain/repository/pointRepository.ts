import { Point } from '../entity/point';

export interface PointRepository {
  charge(point: Point): Promise<Point>;
  findOne(userId: number): Promise<Point>;
  usePoint(point: Point): Promise<Point>;
}
