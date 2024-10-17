import { Test, TestingModule } from '@nestjs/testing';
import { ConcertService } from './concert.service';
import { ConcertRepository } from '../../domain/repository/concertRepository';
import { ScheduleRepository } from '../../domain/repository/scheduleRepository';
import { BadRequestException } from '@nestjs/common';
import Concert from '../../domain/entity/concert.entity';
import Schedule from '../../domain/entity/schedule.entity';

describe('ConcertService', () => {
  let concertService: ConcertService;
  let concertRepository: ConcertRepository;
  let scheduleRepository: ScheduleRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConcertService,
        {
          provide: 'IConcertRepository',
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: 'IScheduleRepository',
          useValue: {
            findSchedules: jest.fn(),
          },
        },
      ],
    }).compile();

    concertService = module.get<ConcertService>(ConcertService);
    concertRepository = module.get<ConcertRepository>('IConcertRepository');
    scheduleRepository = module.get<ScheduleRepository>('IScheduleRepository');
  });

  it('', () => {
    expect(concertService).toBeDefined();
  });

  describe('findConcert', () => {
    it('콘서트를 찾으면 반환해야 한다.', async () => {
      const mockConcert = new Concert(); // 가짜 콘서트 엔티티 생성
      jest.spyOn(concertRepository, 'findOne').mockResolvedValue(mockConcert);

      const result = await concertService.findConcert(1);
      expect(concertRepository.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockConcert);
    });

    it('없는 콘서트일 경우 예외를 던져야 한다.', async () => {
      jest.spyOn(concertRepository, 'findOne').mockResolvedValue(null);

      await expect(concertService.findConcert(1)).rejects.toThrow(
        new BadRequestException('없는 콘서트 입니다. id: 1'),
      );
    });
  });

  describe('findSchedules', () => {
    it('콘서트 일정을 찾으면 반환해야 한다.', async () => {
      const mockSchedules: Schedule[] = [new Schedule(), new Schedule()];
      jest
        .spyOn(scheduleRepository, 'findSchedules')
        .mockResolvedValue(mockSchedules);

      const result = await concertService.findSchedules(1);
      expect(scheduleRepository.findSchedules).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockSchedules);
    });

    it('콘서트 일정이 없으면 예외를 던져야 한다.', async () => {
      jest.spyOn(scheduleRepository, 'findSchedules').mockResolvedValue(null);

      await expect(concertService.findSchedules(1)).rejects.toThrow(
        new BadRequestException('콘서트 일정이 없습니다.'),
      );
    });
  });
});
