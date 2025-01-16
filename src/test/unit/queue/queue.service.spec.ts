import { Queue } from 'src/domain/queue/domain/entity/queue';
import { QueueRepository } from 'src/domain/queue/domain/repository/queue.repository';
import { QueueService } from 'src/domain/queue/domain/service/queue.service';
import { QueueStatusEnum } from 'src/domain/queue/infrastructure/entity/queue.entity';
import { v4 as uuidv4 } from 'uuid';
import { sign } from 'jsonwebtoken';
import { BadRequestException400 } from 'src/common/exception/bad.request.exception.400';

jest.mock('uuid');
jest.mock('jsonwebtoken');

describe('QueueServcice unit test', () => {
  let queueService: QueueService;
  let mockQueueRepository: jest.Mocked<QueueRepository>;

  beforeEach(() => {
    mockQueueRepository = {
      create: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      waitingCount: jest.fn(),
      getWaitingQueue: jest.fn(),
      findExpiredQueues: jest.fn(),
      updateQueues: jest.fn(),
    } as unknown as jest.Mocked<QueueRepository>;

    queueService = new QueueService(mockQueueRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('QueueService가 정의되어 있어야 한다.', () => {
    expect(queueService).toBeDefined();
  });

  describe('createQueue', () => {
    // 성공케이스: 성공적으로 생성 후 반환
    it('성공적으로 Queue를 생성하고 반환한다.', async () => {
      const mockUuid = 'test-uuid';
      (uuidv4 as jest.Mock).mockReturnValue(mockUuid);

      const mockQueue = new Queue({
        id: 1,
        uuid: mockUuid,
        status: QueueStatusEnum.WAIT,
      });
      mockQueueRepository.create.mockResolvedValue(mockQueue);
      const result = await queueService.createQueue();

      expect(mockQueueRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          uuid: mockUuid,
        }),
      );
      expect(result).toEqual(mockQueue);
    });
  });
  describe('createJwt', () => {
    // 성공케이스: 성공적으로 생성 후 반환
    it('성공적으로 jwt를 생성하고 반환한다.', async () => {
      const mockJwt = 'test-jwt-token';
      const mockQueue = new Queue({
        id: 1,
        uuid: 'test-uuid',
        createdAt: new Date(),
      });

      process.env.JWT_SECRET_KEY = 'test-secret';
      (sign as jest.Mock).mockReturnValue(mockJwt);

      const result = await queueService.createJwt(mockQueue);
      expect(result).toEqual(mockJwt);
    });
  });
  describe('findOne', () => {
    // 성공케이스: 성공적으로 조회 후 반환
    it('성공적으로 uuid로 조회 후 반환한다.', async () => {
      const mockUuid = 'test-uuid';
      const mockQueue = new Queue({
        id: 1,
        uuid: 'test-uuid',
        status: QueueStatusEnum.WAIT,
        createdAt: new Date(),
      });

      mockQueueRepository.findOne.mockResolvedValue(mockQueue);
      const result = await queueService.findOne(mockUuid);

      expect(mockQueueRepository.findOne).toHaveBeenCalledWith(mockUuid);
      expect(result).toEqual(mockQueue);
    });
    // 실패케이스: 상태값 에러
    it('WAIT 상태가 아닐경우 에러를 반환한다.', async () => {
      const mockUuid = 'test-uuid';
      const mockQueue = new Queue({
        id: 1,
        uuid: 'test-uuid',
        status: QueueStatusEnum.OUT,
        createdAt: new Date(),
      });

      mockQueueRepository.findOne.mockResolvedValue(mockQueue);

      expect(mockQueueRepository.findOne).not.toHaveBeenCalled();
      await expect(queueService.findOne(mockUuid)).rejects.toThrow(
        new BadRequestException400('대기중이 아닙니다.'),
      );
    });
    // 실패케이스: 조회값이 없는 경우
    it('조회값이 없는 경우 에러를 반환한다..', async () => {
      const mockUuid = 'test-uuid';

      mockQueueRepository.findOne.mockResolvedValue(undefined);

      expect(mockQueueRepository.findOne).not.toHaveBeenCalled();
      await expect(queueService.findOne(mockUuid)).rejects.toThrow(
        new BadRequestException400('없는 대기열 데이터입니다.'),
      );
    });
  });
  describe('update', () => {
    // 성공케이스: 성공적으로 업데이트 후 반환
    it('성공적으로 업데이트 후 업데이트 된 값을 반환한다.', async () => {
      const mockQueue = new Queue({
        id: 1,
        uuid: 'test-uuid',
        status: QueueStatusEnum.WAIT,
        createdAt: new Date(),
      });
      const updatedData: Partial<Queue> = { status: QueueStatusEnum.OUT };
      const updatedQueue = new Queue({
        ...mockQueue,
        ...updatedData,
      });

      mockQueueRepository.update.mockResolvedValue(updatedQueue);

      const result = await queueService.update(mockQueue, updatedData);

      expect(mockQueueRepository.update).toHaveBeenCalledWith(
        mockQueue,
        updatedData,
      );
      expect(result).toEqual(updatedQueue);
    });
  });
  // 성공케이스: 올바른 갯수를 반환한다.
  describe('waitingCount', () => {
    it('상태값이 wait인 값들의 갯수를 반환한다.', async () => {
      const mockWaitingCount = 10;
      mockQueueRepository.waitingCount.mockResolvedValue(mockWaitingCount);

      const result = await queueService.waitingCount();

      expect(mockQueueRepository.waitingCount).toHaveBeenCalled();
      expect(result).toEqual(mockWaitingCount);
    });
  });
});
