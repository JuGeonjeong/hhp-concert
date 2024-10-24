import { Test, TestingModule } from '@nestjs/testing';
import { PaySeatUsecase } from './paySeat.usecase';
import { PaymentService } from './payment.service';
import { PointService } from '../../user/application/service/point.service';
import { QueueService } from '../../queue/application/queue.service';
import { UserService } from '../../user/application/service/user.service';
import Seat from '../../concert/domain/entity/seat.entity';
import User from '../../user/domain/entity/user.entity';
import Point from '../../user/domain/entity/point.entity';
import Payment from '../domain/entity/payment.entity';
import { ConcertService } from 'src/domain/concert/application/service/concert.service';

describe('PaySeatUsecase', () => {
  let paySeatUsecase: PaySeatUsecase;
  let paymentService: PaymentService;
  let userService: UserService;
  let concertService: ConcertService;
  let pointService: PointService;

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
            findAndUpdate: jest.fn(),
          },
        },
      ],
    }).compile();

    paySeatUsecase = module.get<PaySeatUsecase>(PaySeatUsecase);
    paymentService = module.get<PaymentService>(PaymentService);
    userService = module.get<UserService>(UserService);
    concertService = module.get<ConcertService>(ConcertService);
    pointService = module.get<PointService>(PointService);
  });

  it('', () => {
    expect(paySeatUsecase).toBeDefined();
  });

  describe('create', () => {
    it('좌석을 결제하고 좌석 상태를 업데이트하고 토큰을 만료시킨다', async () => {
      const userId = 1;
      const seatId = 2;
      const mockSeat = new Seat();
      mockSeat.price = 10000;
      const mockUser = new User();
      const mockPoint = new Point();
      mockUser.uuid = 'test-uuid';
      const mockPayment = new Payment();

      jest.spyOn(concertService, 'findOne').mockResolvedValue(mockSeat);
      jest.spyOn(userService, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(pointService, 'isPoint').mockResolvedValue(mockPoint);
      jest.spyOn(concertService, 'updateStatus').mockResolvedValue(mockSeat);
      //   jest.spyOn(queueService, 'findAndUpdate').mockResolvedValue(mockUser);
      jest.spyOn(paymentService, 'create').mockResolvedValue(mockPayment);

      //   const result = await paySeatUsecase.create(userId, seatId);

      expect(concertService.findOne).toHaveBeenCalledWith(seatId);
      expect(userService.findOne).toHaveBeenCalledWith(userId);
      expect(pointService.isPoint).toHaveBeenCalledWith(userId, mockSeat.price);
      expect(concertService.updateStatus).toHaveBeenCalledWith(mockSeat);
      //   expect(queueService.findAndUpdate).toHaveBeenCalledWith(mockUser.uuid);
      expect(paymentService.create).toHaveBeenCalledWith(userId, seatId);
      //   expect(result).toEqual(mockPayment);
    });
  });
});
