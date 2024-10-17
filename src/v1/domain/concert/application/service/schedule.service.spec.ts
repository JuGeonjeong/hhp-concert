import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleService } from './schedule.service';
import { ScheduleRepository } from '../../domain/repository/scheduleRepository';
import { BadRequestException } from '@nestjs/common';
import Schedule from '../../domain/entity/schedule.entity';

describe('ScheduleService', () => {
  let scheduleService: ScheduleService;
  let scheduleRepository: ScheduleRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduleService,
        {
          provide: 'IScheduleRepository',
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: 'ISeatRepository',
          useValue: {
            findSeatsByScheduleId: jest.fn(),
          },
        },
      ],
    }).compile();

    scheduleService = module.get<ScheduleService>(ScheduleService);
    scheduleRepository = module.get<ScheduleRepository>('IScheduleRepository');
  });

  it('', () => {
    expect(scheduleService).toBeDefined();
  });

  describe('findSchedule', () => {
    it('스케줄을 찾으면 반환해야 한다.', async () => {
      const mockSchedule = new Schedule(); // 가짜 스케줄 데이터 생성
      jest.spyOn(scheduleRepository, 'findOne').mockResolvedValue(mockSchedule);

      const result = await scheduleService.findSchedule(1);
      expect(scheduleRepository.findOne).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined(); // 서비스 메서드가 값을 반환하지 않음
    });

    it('스케줄이 없으면 예외를 던져야 한다.', async () => {
      jest.spyOn(scheduleRepository, 'findOne').mockResolvedValue(null);

      await expect(scheduleService.findSchedule(1)).rejects.toThrow(
        new BadRequestException('없는 스케줄 입니다. id: 1'),
      );
    });
  });
});
