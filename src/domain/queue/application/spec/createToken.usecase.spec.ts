import { Test, TestingModule } from '@nestjs/testing';
import { CreateTokenUsecase } from '../usecase/createToken.usecase';
import Queue from '../../domain/entity/queue.entity';
import { QueueService } from '../../domain/service/queue.service';

describe('CreateTokenUsecase', () => {
  let createTokenUsecase: CreateTokenUsecase;
  let queueService: QueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTokenUsecase,
        {
          provide: QueueService,
          useValue: {
            createQueue: jest.fn(),
            createJwt: jest.fn(),
          },
        },
      ],
    }).compile();

    createTokenUsecase = module.get<CreateTokenUsecase>(CreateTokenUsecase);
    queueService = module.get<QueueService>(QueueService);
  });

  it('', () => {
    expect(createTokenUsecase).toBeDefined();
  });

  describe('create', () => {
    it('큐와 JWT 토큰을 생성하고 만료일을 반환해야 한다.', async () => {
      const mockQueue = new Queue();
      const mockToken = 'concert';
      const mockExpiryDate = new Date(Date.now() + 60 * 60 * 1000 * 24 * 2);

      jest.spyOn(queueService, 'createQueue').mockResolvedValue(mockQueue);
      jest.spyOn(queueService, 'createJwt').mockResolvedValue(mockToken);

      const result = await createTokenUsecase.create();

      expect(queueService.createQueue).toHaveBeenCalled();
      expect(queueService.createJwt).toHaveBeenCalledWith(mockQueue);
      expect(result).toEqual({
        queue: mockQueue,
        token: mockToken,
        expiryDate: mockExpiryDate,
      });
    });
  });
});
