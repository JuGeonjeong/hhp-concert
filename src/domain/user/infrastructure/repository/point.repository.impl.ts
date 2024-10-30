import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { PointRepository } from '../../domain/repository/pointRepository';
import { Point } from '../../domain/entity/point';
import { PointMapper } from '../mapper/point.mapper';

@Injectable()
export class PointRepositoryImpl implements PointRepository {
  constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

  async charge(point): Promise<Point> {
    const entity = PointMapper.toEntity(new Point(point));
    const pointEntity = await this.manager.save(entity);
    return await this.manager.save(pointEntity);
  }

  async findOne(userId: number): Promise<Point> {
    const entity = await this.manager.findOne(Point, { where: { userId } });
    return PointMapper.toDomain(entity);
  }

  async usePoint(point: Point): Promise<Point> {
    const entity = PointMapper.toEntity(new Point(point));
    const pointEntity = await this.manager.save(entity);
    return await this.manager.save(pointEntity);
  }
}
