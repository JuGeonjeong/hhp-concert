import { Test, TestingModule } from '@nestjs/testing';
import { PointChargeUsecase } from '../usecase/pointCharge.usecase';
import { PointService } from '../../domain/service/point.service';
import { UserService } from '../../domain/service/user.service';
import User from '../../domain/entity/user.entity';
import Point from '../../domain/entity/point.entity';
import { Mutex } from 'async-mutex';

describe('PointChargeUsecase', () => {
  let pointChargeUsecase: PointChargeUsecase;
  let pointService: PointService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PointChargeUsecase,
        {
          provide: PointService,
          useValue: {
            charge: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    pointChargeUsecase = module.get<PointChargeUsecase>(PointChargeUsecase);
    pointService = module.get<PointService>(PointService);
    userService = module.get<UserService>(UserService);
  });

  it('', () => {
    expect(pointChargeUsecase).toBeDefined();
  });

  describe('charge', () => {
    it('유저와 포인트 정보를 반환해야 한다', async () => {
      const userId = 1;
      const points = 5000;
      const user = new User();
      const point = new Point();

      jest.spyOn(userService, 'findOne').mockResolvedValue(user);
      jest.spyOn(pointService, 'charge').mockResolvedValue(point);

      const result = await pointChargeUsecase.charge(userId, points);

      expect(userService.findOne).toHaveBeenCalledWith(userId);
      expect(pointService.charge).toHaveBeenCalledWith(userId, points, user);
      expect(result).toEqual({ user, point });
    });

    it('동시성 제어', async () => {
      const mutex = new Mutex();
      jest.spyOn(mutex, 'runExclusive');

      const userId = 1;
      const points = 100;
      const mockUser = new User();
      const mockPoint = new Point();

      jest.spyOn(userService, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(pointService, 'charge').mockResolvedValue(mockPoint);

      const result = await pointChargeUsecase.charge(userId, points);

      expect(result).toEqual({ user: mockUser, point: mockPoint });
      expect(mutex.runExclusive).toHaveBeenCalled();
    });
  });
});
