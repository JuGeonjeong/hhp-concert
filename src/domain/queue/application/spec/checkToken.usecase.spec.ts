import { Test, TestingModule } from '@nestjs/testing';
import { CheckTokenUsecase } from '../usecase/checkToken.usecase';
import { BadRequestException } from '@nestjs/common';
import { QueueService } from '../../domain/service/queue.service';

describe('CheckTokenUsecase', () => {
  let checkTokenUsecase: CheckTokenUsecase;
  let queueService: QueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckTokenUsecase,
        {
          provide: QueueService,
          useValue: {
            findOne: jest.fn(),
            waitingCount: jest.fn(),
          },
        },
      ],
    }).compile();

    checkTokenUsecase = module.get<CheckTokenUsecase>(CheckTokenUsecase);
    queueService = module.get<QueueService>(QueueService);
  });

  it('', () => {
    expect(checkTokenUsecase).toBeDefined();
  });

  describe('check', () => {
    it('유효한 토큰이면 대기인원과 대기시간을 반환해야 한다.', async () => {
      const token = { uuid: 'test-uuid' };
      const waitingCount = 10;

      //   jest.spyOn(queueService, 'findOne').mockResolvedValue(token.uuid);
      jest.spyOn(queueService, 'waitingCount').mockResolvedValue(waitingCount);

      const result = await checkTokenUsecase.check(token);

      expect(queueService.findOne).toHaveBeenCalledWith(token.uuid);
      expect(queueService.waitingCount).toHaveBeenCalled();
      expect(result).toEqual({ waitingCount, waitingMin: waitingCount * 5 });
    });

    it('유효하지 않은 토큰일 경우 에러를 발생시켜야 한다.', async () => {
      const token = { uuid: 'invalid-uuid' };

      jest.spyOn(queueService, 'findOne').mockImplementation(() => {
        throw new BadRequestException('없는 대기열 데이터입니다.');
      });

      await expect(checkTokenUsecase.check(token)).rejects.toThrow(
        new BadRequestException('없는 대기열 데이터입니다.'),
      );
    });
  });
});
