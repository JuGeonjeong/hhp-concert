import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { PointRepository } from '../../domain/repository/pointRepository';
import { Point } from '../../domain/entity/point';
import { PointMapper } from '../mapper/point.mapper';
import PointEntity from '../entity/point.entity';

@Injectable()
export class PointRepositoryImpl implements PointRepository {
  constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

  async charge(point: Point): Promise<Point> {
    return await this.manager.transaction(
      async (transactionalEntityManager) => {
        const existingPoint = await transactionalEntityManager
          .createQueryBuilder(PointEntity, 'point')
          .setLock('pessimistic_write')
          .where('point.userId = :userId', { userId: point.userId })
          .getOne();

        if (!existingPoint) {
          throw new Error('포인트 정보를 찾을 수 없습니다.');
        }

        existingPoint.amount += point.amount;

        const updatedPointEntity =
          await transactionalEntityManager.save(existingPoint);

        return PointMapper.toDomain(updatedPointEntity);
      },
    );
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
