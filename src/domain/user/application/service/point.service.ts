import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PointRepository } from '../../domain/repository/pointRepository';
import { Point } from '../../domain/entity/point';
// import { Mutex } from 'async-mutex';

@Injectable()
export class PointService {
  constructor(
    @Inject('IPointRepository')
    private readonly pointRepository: PointRepository,
  ) {}

  async charge(body: { userId: number; point: number }): Promise<Point> {
    const { userId } = body;
    // const mutex = new Mutex();
    // return mutex.runExclusive(async () => {
    const exPoint = await this.pointRepository.findOne(userId);
    if (exPoint) {
      if (exPoint.amount + body.point > 100000) {
        throw new BadRequestException(
          `최대보유금을 초과했습니다. 현재: ${exPoint.amount + body.point - 100000}`,
        );
      }
    }
    return await this.pointRepository.charge(body);
    // });
  }

  async findPoint(userId: number): Promise<Point> {
    const data = await this.pointRepository.findOne(userId);
    if (!data) {
      throw new BadRequestException(`보유포인트가 없습니다.`);
    }
    return data;
  }

  async useCheck(userId: number, price: number): Promise<Point> {
    const point = await this.findPoint(userId);
    if (point.amount < price)
      throw new BadRequestException(
        `보유 포인트를 초과했습니다. 보유포인트: ${point.amount}`,
      );
    const calcPoint = point.amount - price;
    const pointEntity = new Point({
      userId,
      amount: calcPoint,
    });
    await this.pointRepository.usePoint(pointEntity);

    return await this.pointRepository.findOne(userId);
  }
}
