import { Test, TestingModule } from '@nestjs/testing';
import { PointChargeUsecase } from '../usecase/pointCharge.usecase';
import { PointService } from '../service/point.service';
import { UserService } from '../service/user.service';
import User from '../../domain/entity/user.entity';
import Point from '../../domain/entity/point.entity';

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

  it('정의되어 있어야 한다', () => {
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

      expect(userService.findOne).toHaveBeenCalledWith(userId); // userService.findOne이 호출되었는지 확인
      expect(pointService.charge).toHaveBeenCalledWith(userId, points, user); // pointService.charge가 호출되었는지 확인
      expect(result).toEqual({ user, point }); // 결과가 예상한 값과 일치하는지 확인
    });
  });
});
