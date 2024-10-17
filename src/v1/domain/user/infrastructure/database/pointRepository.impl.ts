import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { PointRepository } from '../../domain/repository/pointRepository';
import Point from '../../domain/entity/point.entity';
import User from '../../domain/entity/user.entity';

@Injectable()
export class PointRepositoryImpl implements PointRepository {
  constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

  async charge(userId: number, point: number, user: User): Promise<Point> {
    const data = this.manager.create(Point, { user, amount: point });
    return await this.manager.save(data);
  }

  async findOne(userId: number): Promise<Point> {
    return await this.manager.findOne(Point, { where: { userId } });
  }

  async usePoint(point: Point, amount: number): Promise<Point> {
    point.amount = amount;
    return await this.manager.save(point);
  }
}
