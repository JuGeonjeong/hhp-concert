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
    console.log(body);
    return await this.manager.transaction(
      async (transactionalEntityManager) => {
        const existingPoint = await transactionalEntityManager
          .createQueryBuilder(PointEntity, 'point')
          .setLock('pessimistic_write')
          .where('point.userId = :userId', { userId: body.userId })
          .getOne();

        if (!existingPoint) {
          throw new Error('포인트 정보를 찾을 수 없습니다.');
        }
        existingPoint.amount += body.point;
        const updatedPointEntity =
          await transactionalEntityManager.save(existingPoint);

        return PointMapper.toDomain(updatedPointEntity);
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
  async usePoint(point: any): Promise<Point> {
    const entity = PointMapper.toEntity(point);
    const pointEntity = await this.manager.save(entity);
    return await this.manager.save(pointEntity);
  }
}
