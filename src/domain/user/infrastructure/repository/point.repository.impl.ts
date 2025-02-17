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
   * @see {PointRepository.save}
   */
  async save(point: any, body: any, manager: EntityManager): Promise<Point> {
    let entity = await manager.findOne(PointEntity, {
      where: { userId: point ? point.userId : body.userId },
    });

    if (entity) {
      entity.point = point.point;
    } else {
      entity = new PointEntity();
      entity.userId = body.userId;
      entity.point = body.amount;
    }
    const savedPoint = await manager.save(entity);
    return PointMapper.toDomain(savedPoint);
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

  /**
   * @interface
   * @see {PointRepository.findOne}
   */
  async findOneWithLock(
    userId: number,
    manager: EntityManager,
  ): Promise<Point> {
    const entity = await manager.findOne(PointEntity, {
      where: { userId },
      lock: { mode: 'pessimistic_write' },
    });
    return entity ? PointMapper.toDomain(entity) : null;
  }
}
