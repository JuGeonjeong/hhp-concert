import { Test, TestingModule } from '@nestjs/testing';
import { FindPointUsecase } from '../../domain/user/application/usecase/findPoint.usecase';
import { PointService } from '../../domain/user/application/service/point.service';
import { UserService } from '../../domain/user/application/service/user.service';
import UserEntity from 'src/domain/user/infrastructure/entity/user.entity';
import PointEntity from 'src/domain/user/infrastructure/entity/point.entity';

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

  it('', () => {
    expect(findPointUsecase).toBeDefined();
  });

  describe('findOne', () => {
    it('유저와 포인트 정보를 반환해야 한다.', async () => {
      const userId = 1;
      const user = new UserEntity();
      const point = new PointEntity();

      jest.spyOn(userService, 'findOne').mockResolvedValue(user);
      jest.spyOn(pointService, 'findPoint').mockResolvedValue(point);

      const result = await findPointUsecase.findOne(userId);

      expect(userService.findOne).toHaveBeenCalledWith(userId);
      expect(pointService.findPoint).toHaveBeenCalledWith(userId);
      expect(result).toEqual({ user, point });
    });
  });
});
