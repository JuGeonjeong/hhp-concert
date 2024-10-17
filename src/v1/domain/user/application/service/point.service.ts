import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import Point from '../../domain/entity/point.entity';
import { PointRepository } from '../../domain/repository/pointRepository';
import User from '../../domain/entity/user.entity';

@Injectable()
export class PointService {
  constructor(
    @Inject('IPointRepository')
    private readonly pointRepository: PointRepository,
  ) {}

  async charge(userId: number, point: number, user: User): Promise<Point> {
    const exPoint = await this.pointRepository.findOne(userId);
    if (exPoint) {
      if (exPoint.amount <= 100000) {
        throw new BadRequestException(
          `최대보유금을 초과했습니다. 현재: ${100000 - exPoint.amount}`,
        );
      }
    }
    return await this.pointRepository.charge(userId, point, user);
  }
  async findPoint(userId: number): Promise<Point> {
    return await this.pointRepository.findOne(userId);
  }
}
