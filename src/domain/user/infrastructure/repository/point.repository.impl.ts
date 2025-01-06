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

  /**
   * @interface
   * @see {PointRepository.charge}
   */
  async charge(body: { userId: number; point: number }): Promise<Point> {
    return await this.manager.transaction(
      async (transactionalEntityManager) => {
        let point = await transactionalEntityManager
          .createQueryBuilder(PointEntity, 'point')
          .setLock('pessimistic_write')
          .where('point.userId = :userId', { userId: body.userId })
          .getOne();

        if (!point) {
          point = new PointEntity();
          point.userId = body.userId;
          point.amount = body.point;
        } else {
          point.amount += body.point;
        }

        const savedPoint = await transactionalEntityManager.save(point);
        return PointMapper.toDomain(savedPoint);
      },
    );
  }

  /**
   * @interface
   * @see {PointRepository.findOne}
   */
  async findOne(userId: number): Promise<Point> {
    const entity = await this.manager.findOne(PointEntity, {
      where: { userId },
    });
    return entity ? PointMapper.toDomain(entity) : null;
  }

  /**
   * @interface
   * @see {PointRepository.usePoint}
   */
  async usePoint(point: any): Promise<any> {
    const entity = PointMapper.toEntity(point);
    const pointEntity = await this.manager.save(entity);
    return await this.manager.save(pointEntity);
  }
}
