import { Test, TestingModule } from '@nestjs/testing';
import { PointService } from './point.service';
import { PointRepository } from '../../domain/repository/pointRepository';
import { BadRequestException } from '@nestjs/common';
import Point from '../../domain/entity/point.entity';
import User from '../../domain/entity/user.entity';

describe('PointService', () => {
  let pointService: PointService;
  let pointRepository: PointRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PointService,
        {
          provide: 'IPointRepository',
          useValue: {
            findOne: jest.fn(),
            charge: jest.fn(),
            usePoint: jest.fn(),
          },
        },
      ],
    }).compile();

    pointService = module.get<PointService>(PointService);
    pointRepository = module.get<PointRepository>('IPointRepository');
  });

  it('', () => {
    expect(pointService).toBeDefined();
  });

  describe('charge', () => {
    it('포인트 금액이 100000을 초과하면 에러를 발생시켜야 한다', async () => {
      const maxPoint = 100000;
      const user = new User();
      const exPoint = new Point();
      exPoint.amount = 95000;

      jest.spyOn(pointRepository, 'findOne').mockResolvedValue(exPoint);

      await expect(pointService.charge(1, 6000, user)).rejects.toThrowError(
        new BadRequestException(
          `최대보유금을 초과했습니다. 현재: ${maxPoint - exPoint.amount}`,
        ),
      );
    });
  });

  describe('findPoint', () => {
    it('사용자에 대한 포인트 정보를 반환해야 한다', async () => {
      const point = new Point();
      jest.spyOn(pointRepository, 'findOne').mockResolvedValue(point);

      const result = await pointService.findPoint(1);
      expect(pointRepository.findOne).toHaveBeenCalledWith(1);
      expect(result).toBe(point);
    });
  });

  describe('isPoint', () => {
    it('포인트가 부족하면 에러를 발생시켜야 한다', async () => {
      const point = new Point();
      point.amount = 30000;
      jest.spyOn(pointRepository, 'findOne').mockResolvedValue(point);

      await expect(pointService.isPoint(1, 50000)).rejects.toThrowError(
        new BadRequestException(
          `보유 포인트를 초과했습니다. 보유포인트: ${point.amount}`,
        ),
      );
    });

    it('포인트가 충분하면 업데이트된 포인트를 반환해야 한다', async () => {
      const point = new Point();
      point.amount = 60000;

      jest.spyOn(pointRepository, 'findOne').mockResolvedValue(point);
      jest.spyOn(pointRepository, 'usePoint').mockResolvedValue(point);

      const result = await pointService.isPoint(1, 20000);
      expect(pointRepository.usePoint).toHaveBeenCalledWith(point, 40000);
      expect(result).toBe(point);
    });
  });
});
