import { Inject, Injectable } from '@nestjs/common';
import { PointRepository } from '../../domain/repository/pointRepository';
import { Point } from '../../domain/entity/point';
import { BadRequestException400 } from 'src/common/exception/bad.request.exception.400';
import { DataSource } from 'typeorm';

@Injectable()
export class PointService {
  constructor(
    @Inject('IPointRepository')
    private readonly pointRepository: PointRepository,
    private readonly dataSource: DataSource,
  ) {}

  async charge(body: any): Promise<any> {
    const { userId, amount } = body;

    return await this.dataSource.transaction(async (manager) => {
      const point = await this.pointRepository.findOneWithLock(userId, manager);
      if (point) {
        point.check(amount);
        point.charge(amount);
      }

      return await this.pointRepository.save(point, body, manager);
    });
  }

  async findPoint(userId: number): Promise<any> {
    const data = await this.pointRepository.findOne(userId);
    if (!data) {
      return { userId, amount: 0 };
    }
    return data;
  }

  async useCheck(userId: number, price: number): Promise<Point> {
    const point = await this.findPoint(userId);
    if (point.amount < price)
      throw new BadRequestException400(
        `보유 포인트를 초과했습니다. 보유포인트: ${point.amount}`,
      );
    const calcPoint = point.amount - price;
    const pointEntity = new Point({
      userId,
      point: calcPoint,
    });
    await this.pointRepository.usePoint(pointEntity);

    return await this.pointRepository.findOne(userId);
  }
}
