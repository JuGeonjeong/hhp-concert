import { Test, TestingModule } from '@nestjs/testing';
import { PaySeatUsecase } from '../../domain/payment/application/usecase/paySeat.usecase';
import Seat from '../../domain/concert/domain/entity/seat';
import User from '../../domain/user/domain/entity/user';
import Point from '../../domain/user/domain/entity/point';
import Payment from '../../domain/payment/domain/entity/payment';
import { Mutex } from 'async-mutex';
import Queue, { QueueStatusEnum } from '../../domain/queue/domain/entity/queue';
import { PointService } from 'src/domain/user/application/service/point.service';
import { QueueService } from 'src/domain/queue/application/service/queue.service';
import { UserService } from 'src/domain/user/application/service/user.service';
import { ConcertService } from 'src/domain/concert/application/service/concert.service';
import { PaymentService } from 'src/domain/payment/application/service/payment.service';

describe('PaySeatUsecase', () => {
  let paySeatUsecase: PaySeatUsecase;
  let paymentService: PaymentService;
  let userService: UserService;
  let concertService: ConcertService;
  let pointService: PointService;
  let queueService: QueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaySeatUsecase,
        {
          provide: PaymentService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: ConcertService,
          useValue: {
            findOne: jest.fn(),
            updateStatus: jest.fn(),
          },
        },
        {
          provide: PointService,
          useValue: {
            isPoint: jest.fn(),
          },
        },
        {
          provide: QueueService,
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    paySeatUsecase = module.get<PaySeatUsecase>(PaySeatUsecase);
    paymentService = module.get<PaymentService>(PaymentService);
    userService = module.get<UserService>(UserService);
    concertService = module.get<ConcertService>(ConcertService);
    pointService = module.get<PointService>(PointService);
    queueService = module.get<QueueService>(QueueService);
  });

  it('', () => {
    expect(paySeatUsecase).toBeDefined();
  });

  describe('create', () => {
    it('좌석을 결제하고 좌석 상태를 업데이트하고 토큰을 만료시킨다 (동시성 제어 포함)', async () => {
      const userId = 1;
      const seatId = 2;
      const mockSeat = new Seat();
      mockSeat.price = 10000;
      const mockUser = new User();
      mockUser.uuid = 'test-uuid';
      const mockPoint = new Point();
      const mockQueue = new Queue();
      const mockPayment = new Payment();

      jest.spyOn(concertService, 'findOne').mockResolvedValue(mockSeat);
      jest.spyOn(userService, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(pointService, 'isPoint').mockResolvedValue(mockPoint);
      jest.spyOn(concertService, 'updateStatus').mockResolvedValue(mockSeat);
      jest.spyOn(queueService, 'findOne').mockResolvedValue(mockQueue);
      jest.spyOn(queueService, 'update').mockResolvedValue(mockQueue);
      jest.spyOn(paymentService, 'create').mockResolvedValue(mockPayment);

      const mutex = new Mutex();
      const runExclusiveSpy = jest
        .spyOn(mutex, 'runExclusive')
        .mockImplementation(async (fn) => await fn());

      const result = await paySeatUsecase.create(userId, seatId);

      expect(runExclusiveSpy).toHaveBeenCalled();
      expect(concertService.findOne).toHaveBeenCalledWith(seatId);
      expect(userService.findOne).toHaveBeenCalledWith(userId);
      expect(pointService.isPoint).toHaveBeenCalledWith(userId, mockSeat.price);
      expect(concertService.updateStatus).toHaveBeenCalledWith(mockSeat);
      expect(queueService.findOne).toHaveBeenCalledWith(mockUser.uuid);
      expect(queueService.update).toHaveBeenCalledWith(mockQueue, {
        status: QueueStatusEnum.OUT,
      });
      expect(paymentService.create).toHaveBeenCalledWith(userId, seatId);
      expect(result).toEqual(mockPayment);
    });
  });
});
