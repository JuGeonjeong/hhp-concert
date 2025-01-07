import { BadRequestException400 } from 'src/common/exception/bad.request.exception.400';
import { Point } from 'src/domain/user/domain/entity/point';
import { PointRepository } from 'src/domain/user/domain/repository/pointRepository';
import { PointService } from 'src/domain/user/domain/service/point.service';

describe('PointService unit test', () => {
  let pointService: PointService;
  let mockPointRepository: jest.Mocked<PointRepository>;

  beforeEach(() => {
    mockPointRepository = {
      charge: jest.fn(),
      findOne: jest.fn(),
      usePoint: jest.fn(),
    } as unknown as jest.Mocked<PointRepository>;

    pointService = new PointService(mockPointRepository);
  });

  it('PointServie가 정의되어 있어야 한다.', () => {
    expect(pointService).toBeDefined();
  });
  describe('charge', () => {
    it('포인트를 충전하고 충전된 포인트 값을 반환한다.', async () => {
      const userId = 2;
      const point = 1000;
      const exPoint = { userId, amount: 1000 };
      const savedPoint = new Point({
        userId,
        amount: 2000,
      });

      mockPointRepository.findOne.mockResolvedValue(exPoint);
      mockPointRepository.charge.mockResolvedValue(savedPoint);

      const result = await pointService.charge({ userId, point });
      expect(result).toEqual({ userId, amount: 2000 });

      expect(mockPointRepository.findOne).toHaveBeenCalledWith(userId);
      expect(mockPointRepository.charge).toHaveBeenCalledWith({
        userId,
        point,
      });
    });
    it('포인트가 없을 경우 새로 생성하고 반환한다.', async () => {
      const userId = 99;
      const point = 5000;
      const newPoint = { userId, amount: point };

      mockPointRepository.findOne.mockResolvedValue(null);
      mockPointRepository.charge.mockResolvedValue(newPoint);

      const result = await pointService.charge({ userId, point });
      expect(result).toEqual(newPoint);

      expect(mockPointRepository.findOne).toHaveBeenCalledWith(userId);
      expect(mockPointRepository.charge).toHaveBeenCalledWith({
        userId,
        point,
      });
    });

    it('포인트 충전 후 상한선을 초과하는 경우 예외를 발생시킨다.', async () => {
      const userId = 3;
      const point = 90000;
      const exPoint = { userId, amount: 20000 };

      mockPointRepository.findOne.mockResolvedValue(exPoint);

      await expect(pointService.charge({ userId, point })).rejects.toThrow(
        new BadRequestException400(
          '최대 충전 가능한 포인트는 100,000입니다. 다시 시도해주세요.',
        ),
      );

      expect(mockPointRepository.findOne).toHaveBeenCalledWith(userId);
      expect(mockPointRepository.charge).not.toHaveBeenCalled();
    });
  });
  describe('findPoint', () => {
    // 성공케이스: 조회 성공시 올바른값 반환
    it('userId의 올바른 값을 반환해야 한다.', async () => {
      const userId = 1;
      const exPoint = { userId, amount: 20000 };

      mockPointRepository.findOne.mockResolvedValue(exPoint);

      const result = await pointService.findPoint(userId);
      expect(result).toEqual(exPoint);

      expect(mockPointRepository.findOne).toHaveBeenCalledWith(userId);
    });
    // 성공케이스: findOne의 값이 null일 경우
    it('반환값이 null일 경우, amount: 0 으로 반환한다.', async () => {
      const userId = 1;
      const exPoint = { userId, amount: 0 };

      mockPointRepository.findOne.mockResolvedValue(null);

      const result = await pointService.findPoint(userId);
      expect(result).toEqual(exPoint);

      expect(mockPointRepository.findOne).toHaveBeenCalledWith(userId);
    });
  });
  describe('useCheck', () => {
    it('포인트가 충분할 경우 정상적으로 사용 후 업데이트된 포인트를 반환한다.', async () => {
      const userId = 1;
      const price = 3000;
      const initialPoint = { userId, amount: 5000 };
      const updatedPoint = { userId, amount: 2000 };
      const pointEntity = new Point({ userId, amount: 2000 });

      mockPointRepository.findOne.mockResolvedValueOnce(initialPoint);
      mockPointRepository.usePoint.mockResolvedValue(undefined);
      mockPointRepository.findOne.mockResolvedValueOnce(updatedPoint);

      const result = await pointService.useCheck(userId, price);

      expect(mockPointRepository.findOne).toHaveBeenCalledWith(userId);
      expect(mockPointRepository.usePoint).toHaveBeenCalledWith(pointEntity);
      expect(result).toEqual(updatedPoint);
    });

    it('포인트가 부족할 경우 예외를 발생시킨다.', async () => {
      const userId = 1;
      const price = 6000;
      const initialPoint = { userId, amount: 5000 };

      mockPointRepository.findOne.mockResolvedValue(initialPoint);

      await expect(pointService.useCheck(userId, price)).rejects.toThrow(
        new BadRequestException400(
          `보유 포인트를 초과했습니다. 보유포인트: ${initialPoint.amount}`,
        ),
      );

      expect(mockPointRepository.findOne).toHaveBeenCalledWith(userId);
      expect(mockPointRepository.usePoint).not.toHaveBeenCalled();
    });
  });
});
