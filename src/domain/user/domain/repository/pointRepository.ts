import { EntityManager } from 'typeorm';
import { Point } from '../entity/point';

export interface PointRepository {
  findOne(userId: number): Promise<Point>;
  findOneWithLock(userId: number, manager: any): Promise<Point>;
  usePoint(point: any): Promise<Point>;
  save(point: any, body: any, manager: EntityManager): Promise<Point>;
}
