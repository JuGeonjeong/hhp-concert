import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ConcertService } from '../service/concert.service';
import { AvailableSeatsUsecase } from '../usecase/availableSeats.usecase';

describe('availableSeatsUsecase', () => {
  let availableSeatsUsecase: AvailableSeatsUsecase;
  let concertService: ConcertService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvailableSeatsUsecase,
        {
          provide: ConcertService,
          useValue: {
            findSchedule: jest.fn(),
          },
        },
      ],
    }).compile();

    availableSeatsUsecase = module.get<AvailableSeatsUsecase>(
      AvailableSeatsUsecase,
    );
    concertService = module.get<ConcertService>(ConcertService);
  });

  it('', () => {
    expect(availableSeatsUsecase).toBeDefined();
  });

  describe('findSeats', () => {
    it('스케줄과 좌석을 찾아야 한다', async () => {
      const scheduleId = 1;
      const mockSeats = [{ seatNumber: 1 }, { seatNumber: 2 }];

      //   jest.spyOn(concertService, 'findSchedule').mockResolvedValue(scheduleId);
      //   jest.spyOn(seatService, 'findSeats').mockResolvedValue(mockSeats);

      const result = await availableSeatsUsecase.findSeats(scheduleId);

      expect(concertService.findSchedule).toHaveBeenCalledWith(scheduleId);
      expect(concertService.findSeats).toHaveBeenCalledWith(scheduleId);
      expect(result).toEqual(mockSeats);
    });

    it('스케줄이 없을 경우 에러를 던져야 한다', async () => {
      const scheduleId = 999;

      jest.spyOn(concertService, 'findSchedule').mockImplementation(() => {
        throw new BadRequestException(`없는 스케줄 입니다. id: ${scheduleId}`);
      });

      await expect(availableSeatsUsecase.findSeats(scheduleId)).rejects.toThrow(
        new BadRequestException(`없는 스케줄 입니다. id: ${scheduleId}`),
      );
    });
  });
});
