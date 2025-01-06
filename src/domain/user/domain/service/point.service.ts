import { Inject, Injectable } from '@nestjs/common';
import { PointRepository } from '../../domain/repository/pointRepository';
import { Point } from '../../domain/entity/point';
import { BadRequestException400 } from 'src/common/exception/bad.request.exception.400';
// import { Mutex } from 'async-mutex';

@Injectable()
export class PointService {
  constructor(
    @Inject('IPointRepository')
    private readonly pointRepository: PointRepository,
  ) {}

  async charge(body: { userId: number; point: number }): Promise<Point> {
    const { userId, point } = body;
    // const mutex = new Mutex();
    // return mutex.runExclusive(async () => {
    const exPoint = await this.pointRepository.findOne(userId);
    if (exPoint) {
      if (exPoint.amount + point > 100000) {
        throw new BadRequestException400(
          '최대 충전 가능한 포인트는 100,000입니다. 다시 시도해주세요.',
        );
      }
    }
    return await this.pointRepository.charge(body);
    // });
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
      amount: calcPoint,
    });
    await this.pointRepository.usePoint(pointEntity);

    return await this.pointRepository.findOne(userId);
  }
}
