import { Test, TestingModule } from '@nestjs/testing';
import { TakeSeatUsecase } from '../usecase/takeSeat.usecase';
import Seat from '../../domain/entity/seat.entity';
import { ConcertService } from '../service/concert.service';

describe('takeSeatUsecase', () => {
  let takeSeatUsecase: TakeSeatUsecase;
  let concertService: ConcertService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TakeSeatUsecase,
        {
          provide: ConcertService,
          useValue: {
            cancelSeat: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    takeSeatUsecase = module.get<TakeSeatUsecase>(TakeSeatUsecase);
    concertService = module.get<ConcertService>(ConcertService);
  });

  it('정의되어 있어야 한다', () => {
    expect(takeSeatUsecase).toBeDefined();
  });

  describe('reserv', () => {
    it('좌석을 취소하고 새로 예약해야 한다', async () => {
      const body = { userId: 1, seatNumber: 10, scheduleId: 5 };

      jest.spyOn(concertService, 'cancelSeat').mockResolvedValue(null);
      const mockSeat = new Seat();
      jest.spyOn(concertService, 'create').mockResolvedValue(mockSeat);

      const result = await takeSeatUsecase.reserv(body);

      expect(concertService.cancelSeat).toHaveBeenCalledWith(body);
      expect(concertService.create).toHaveBeenCalledWith(body);
      expect(result).toEqual(mockSeat);
    });
  });
});
