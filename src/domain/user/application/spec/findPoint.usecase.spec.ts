import { Test, TestingModule } from '@nestjs/testing';
import { FindPointUsecase } from '../usecase/findPoint.usecase';
import { PointService } from '../service/point.service';
import { UserService } from '../service/user.service';
import User from '../../domain/entity/user.entity';
import Point from '../../domain/entity/point.entity';

describe('FindPointUsecase', () => {
  let findPointUsecase: FindPointUsecase;
  let pointService: PointService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindPointUsecase,
        {
          provide: PointService,
          useValue: {
            findPoint: jest.fn(),
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

    findPointUsecase = module.get<FindPointUsecase>(FindPointUsecase);
    pointService = module.get<PointService>(PointService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(findPointUsecase).toBeDefined();
  });

  describe('findOne', () => {
    it('유저와 포인트 정보를 반환해야 한다.', async () => {
      const userId = 1;
      const user = new User();
      const point = new Point();

      jest.spyOn(userService, 'findOne').mockResolvedValue(user);
      jest.spyOn(pointService, 'findPoint').mockResolvedValue(point);

      const result = await findPointUsecase.findOne(userId);

      expect(userService.findOne).toHaveBeenCalledWith(userId);
      expect(pointService.findPoint).toHaveBeenCalledWith(userId);
      expect(result).toEqual({ user, point });
    });
  });
});
