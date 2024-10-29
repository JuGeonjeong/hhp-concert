import { Test, TestingModule } from '@nestjs/testing';
import { AvailableDatesUsecase } from '../../application/usecase/availableDates.usecase';
import { BadRequestException } from '@nestjs/common';
import { ConcertService } from '../../domain/service/concert.service';

describe('availableDatesUsecase', () => {
  let availableDatesUsecase: AvailableDatesUsecase;
  let concertService: ConcertService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvailableDatesUsecase,
        {
          provide: ConcertService,
          useValue: {
            findConcert: jest.fn(),
            findSchedules: jest.fn(),
          },
        },
      ],
    }).compile();

    availableDatesUsecase = module.get<AvailableDatesUsecase>(
      AvailableDatesUsecase,
    );
    concertService = module.get<ConcertService>(ConcertService);
  });

  it('', () => {
    expect(availableDatesUsecase).toBeDefined();
  });

  describe('findDates', () => {
    it('콘서트 일정을 찾아야 한다', async () => {
      const concertId = 1;
      const mockSchedules = '2024-11-11';

      // jest.spyOn(concertService, 'findConcert').mockResolvedValue(concertId);
      // jest.spyOn(concertService, 'findSchedules').mockResolvedValue(concertId);

      const result = await availableDatesUsecase.findDates(concertId);

      expect(concertService.findConcert).toHaveBeenCalledWith(concertId);
      expect(concertService.findSchedules).toHaveBeenCalledWith(concertId);
      expect(result).toEqual(mockSchedules);
    });

    it('없는 콘서트일 경우 에러를 던져야 한다', async () => {
      const concertId = 999;

      jest.spyOn(concertService, 'findConcert').mockImplementation(() => {
        throw new BadRequestException(`없는 콘서트 입니다. id: ${concertId}`);
      });

      await expect(availableDatesUsecase.findDates(concertId)).rejects.toThrow(
        new BadRequestException(`없는 콘서트 입니다. id: ${concertId}`),
      );
    });
  });
});
