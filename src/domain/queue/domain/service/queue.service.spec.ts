import { Test, TestingModule } from '@nestjs/testing';
import { QueueService } from './queue.service';
import { BadRequestException } from '@nestjs/common';
import { QueueRepository } from '../repository/queue.repository';
import Queue, { QueueStatusEnum } from '../entity/queue.entity';
// import { sign } from 'jsonwebtoken';

describe('QueueService', () => {
  let queueService: QueueService;
  let queueRepository: QueueRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueService,
        {
          provide: 'IQueueRepository',
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            findAndUpdate: jest.fn(),
            waitingCount: jest.fn(),
            findStatusEnter: jest.fn(),
          },
        },
      ],
    }).compile();

    queueService = module.get<QueueService>(QueueService);
    queueRepository = module.get<QueueRepository>('IQueueRepository');
  });

  it('', () => {
    expect(queueService).toBeDefined();
  });

  describe('createQueue', () => {
    it('대기열을 생성해야 한다', async () => {
      const queue = new Queue();
      jest.spyOn(queueRepository, 'create').mockResolvedValue(queue);

      const result = await queueService.createQueue();

      expect(queueRepository.create).toHaveBeenCalled();
      expect(result).toEqual(queue);
    });
  });

  describe('createJwt', () => {
    // it('JWT 토큰을 생성해야 한다', async () => {
    //   const queue = new Queue();
    //   queue.uuid = 'test-uuid';
    //   queue.createdAt = new Date();
    //   queue.enteredAt = new Date();
    //   const token = sign(
    //     {
    //       uuid: queue.uuid,
    //       createdAt: queue.createdAt,
    //       enteredAt: queue.enteredAt,
    //     },
    //     'concert',
    //     {
    //       expiresIn: '2d',
    //       issuer: 'concert',
    //     },
    //   );
    //   const result = await queueService.createJwt(queue);
    //   expect(result).toBe(token);
    // });
  });

  describe('findOne', () => {
    it('대기열을 조회하고 상태가 WAIT이면 반환해야 한다', async () => {
      const queue = new Queue();
      queue.status = QueueStatusEnum.WAIT;
      jest.spyOn(queueRepository, 'findOne').mockResolvedValue(queue);

      const result = await queueService.findOne('test-uuid');

      expect(queueRepository.findOne).toHaveBeenCalledWith('test-uuid');
      expect(result).toEqual(queue);
    });

    it('대기열 상태가 WAIT이 아니면 예외를 발생시켜야 한다', async () => {
      const queue = new Queue();
      queue.status = QueueStatusEnum.ENTER;
      jest.spyOn(queueRepository, 'findOne').mockResolvedValue(queue);

      await expect(queueService.findOne('test-uuid')).rejects.toThrow(
        new BadRequestException(`대기중이 아닙니다.`),
      );
    });

    it('대기열이 존재하지 않으면 예외를 발생시켜야 한다', async () => {
      jest.spyOn(queueRepository, 'findOne').mockResolvedValue(null);

      await expect(queueService.findOne('test-uuid')).rejects.toThrow(
        new BadRequestException(`없는 대기열 데이터입니다.`),
      );
    });
  });

  describe('update', () => {
    it('대기열을 업데이트 해야 한다', async () => {
      const queue = new Queue();
      const data = { status: QueueStatusEnum.OUT };
      jest.spyOn(queueRepository, 'update').mockResolvedValue(queue);

      const result = await queueService.update(queue, data);

      expect(queueRepository.update).toHaveBeenCalledWith(queue);
      expect(result).toEqual(queue);
    });
  });

  describe('waitingCount', () => {
    it('대기중인 인원수를 반환해야 한다', async () => {
      const count = 10;
      jest.spyOn(queueRepository, 'waitingCount').mockResolvedValue(count);

      const result = await queueService.waitingCount();

      expect(queueRepository.waitingCount).toHaveBeenCalled();
      expect(result).toEqual(count);
    });
  });
});
