import { Point } from '../entity/point';

export interface PointRepository {
  charge(body: { userId: number; point: number }): Promise<Point>;
  findOne(userId: number): Promise<Point>;
  usePoint(point: any): Promise<Point>;
}
