import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ConcertService } from 'src/domain/concert/application/service/concert.service';
import { Concert } from 'src/domain/concert/domain/entity/concert';
import { Schedule } from 'src/domain/concert/domain/entity/schedule';
import { Seat } from 'src/domain/concert/domain/entity/seat';
import { ConcertRepository } from 'src/domain/concert/domain/repository/concertRepository';
import { ScheduleRepository } from 'src/domain/concert/domain/repository/scheduleRepository';
import { SeatRepository } from 'src/domain/concert/domain/repository/seatRepository';
import { SeatStatusEnum } from 'src/domain/concert/infrastructure/entity/seat.entity';

describe('ConcertService', () => {
  let concertService: ConcertService;
  let concertRepository: ConcertRepository;
  let scheduleRepository: ScheduleRepository;
  let seatRepository: SeatRepository;

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
            findOne: jest.fn(),
            findSchedules: jest.fn(),
          },
        },
        {
          provide: 'ISeatRepository',
          useValue: {
            create: jest.fn(),
            exSeat: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            findSeats: jest.fn(),
          },
        },
      ],
    }).compile();

    concertService = module.get<ConcertService>(ConcertService);
    concertRepository = module.get<ConcertRepository>('IConcertRepository');
    scheduleRepository = module.get<ScheduleRepository>('IScheduleRepository');
    seatRepository = module.get<SeatRepository>('ISeatRepository');
  });

  it('', () => {
    expect(concertService).toBeDefined();
  });

  describe('findConcert', () => {
    it('콘서트를 찾으면 반환해야 한다.', async () => {
      const mockConcert = new Concert({
        id: 1,
        name: 'Summer Music Festival',
        createdAt: new Date('2023-08-01T10:00:00Z'),
        updatedAt: new Date('2023-08-01T10:00:00Z'),
        deletedAt: null,
      });
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
      const mockSchedules: Schedule[] = [
        new Schedule({
          id: 1,
          concertId: 101,
          date: new Date('2023-12-01T18:00:00Z'),
          seats: [], //
          maximum: 100,
          count: 10,
          createdAt: new Date('2023-10-01T10:00:00Z'),
          updatedAt: new Date('2023-10-01T10:00:00Z'),
          deletedAt: null,
        }),
        new Schedule({
          id: 2,
          concertId: 102,
          date: new Date('2023-12-05T20:00:00Z'),
          seats: [],
          maximum: 150,
          count: 20,
          createdAt: new Date('2023-10-02T12:00:00Z'),
          updatedAt: new Date('2023-10-02T12:00:00Z'),
          deletedAt: null,
        }),
      ];
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

  // SeatDomain
  describe('create', () => {
    it('좌석을 생성해야 한다.', async () => {
      const seatDto = { seatNumber: 1 };
      const createdSeat = new Seat({
        id: 2,
        scheduleId: 101,
        userId: 2002,
        seatNumber: 2,
        expiredAt: new Date('2023-12-01T18:45:00Z'),
        price: 5000,
        status: SeatStatusEnum.RESERVED,
        isReserved: true,
        userInfo: undefined,
        version: 1,
        createdAt: new Date('2023-11-01T12:00:00Z'),
        updatedAt: new Date('2023-11-01T12:00:00Z'),
        deletedAt: null,
      });
      jest.spyOn(seatRepository, 'create').mockResolvedValue(createdSeat);

      const result = await concertService.create(seatDto);

      expect(seatRepository.create).toHaveBeenCalledWith(seatDto);
      expect(result).toEqual(createdSeat);
    });
  });

  describe('cancelSeat', () => {
    it('좌석을 취소해야 한다.', async () => {
      const seatDto = { seatNumber: 1 };
      const exSeat = new Seat({
        id: 2,
        scheduleId: 101,
        userId: 2002,
        seatNumber: 2,
        expiredAt: new Date('2023-12-01T18:45:00Z'),
        price: 5000,
        status: SeatStatusEnum.RESERVED,
        isReserved: true,
        userInfo: undefined,
        version: 1,
        createdAt: new Date('2023-11-01T12:00:00Z'),
        updatedAt: new Date('2023-11-01T12:00:00Z'),
        deletedAt: null,
      });
      exSeat.seatNumber = 1;

      jest.spyOn(seatRepository, 'exSeat').mockResolvedValue(exSeat);
      jest.spyOn(seatRepository, 'cancel').mockResolvedValue(undefined);

      const result = await concertService.cancelSeat(seatDto);

      expect(seatRepository.exSeat).toHaveBeenCalledWith(seatDto);
      expect(seatRepository.cancel).toHaveBeenCalledWith(exSeat.seatNumber);
      expect(result).toEqual(exSeat);
    });

    it('좌석이 없으면 취소할 수 없다.', async () => {
      const seatDto = { seatNumber: 1 };
      jest.spyOn(seatRepository, 'exSeat').mockResolvedValue(null);

      const result = await concertService.cancelSeat(seatDto);

      expect(seatRepository.exSeat).toHaveBeenCalledWith(seatDto.seatNumber);
      expect(seatRepository.cancel).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('findOne', () => {
    it('좌석을 조회해야 한다.', async () => {
      const seatId = 1;
      const foundSeat = new Seat({
        id: 2,
        scheduleId: 101,
        userId: 2002,
        seatNumber: 2,
        expiredAt: new Date('2023-12-01T18:45:00Z'),
        price: 5000,
        status: SeatStatusEnum.RESERVED,
        isReserved: true,
        userInfo: undefined,
        version: 1,
        createdAt: new Date('2023-11-01T12:00:00Z'),
        updatedAt: new Date('2023-11-01T12:00:00Z'),
        deletedAt: null,
      });
      jest.spyOn(seatRepository, 'findOne').mockResolvedValue(foundSeat);

      const result = await concertService.findOne(seatId);

      expect(seatRepository.findOne).toHaveBeenCalledWith(seatId);
      expect(result).toEqual(foundSeat);
    });
  });

  describe('findSeats', () => {
    it('좌석이 없으면 예외를 던져야 한다.', async () => {
      const scheduleId = 1;
      jest.spyOn(seatRepository, 'findSeats').mockResolvedValue(null);

      await expect(concertService.findSeats(scheduleId)).rejects.toThrow(
        new BadRequestException(`없는 스케줄 입니다. id: ${scheduleId}`),
      );
    });

    // it('빈 좌석을 반환해야 한다.', async () => {
    //   const scheduleId = 1;
    //   const seats = [{ seatNumber: 1 }, { seatNumber: 2 }];
    //   jest.spyOn(seatRepository, 'findSeats').mockResolvedValue(seats);

    //   const result = await concertService.findSeats(scheduleId);

    //   expect(seatRepository.findSeats).toHaveBeenCalledWith(scheduleId);
    //   expect(result).toEqual([3, 4, 5, 6, 7, 8, 9, 10]); // 예시 빈 좌석
    // });
  });

  describe('updateStatus', () => {
    it('좌석 상태를 업데이트해야 한다.', async () => {
      const seat = new Seat({
        id: 2,
        scheduleId: 101,
        userId: 2002,
        seatNumber: 2,
        expiredAt: new Date('2023-12-01T18:45:00Z'),
        price: 5000,
        status: SeatStatusEnum.RESERVED,
        isReserved: true,
        userInfo: undefined,
        version: 1,
        createdAt: new Date('2023-11-01T12:00:00Z'),
        updatedAt: new Date('2023-11-01T12:00:00Z'),
        deletedAt: null,
      });
      jest.spyOn(seatRepository, 'update').mockResolvedValue(seat);

      const result = await concertService.updateStatus(seat);

      expect(seatRepository.update).toHaveBeenCalledWith(seat);
      expect(result).toEqual(seat);
    });
  });

  // ScheduleDomain
  describe('findSchedule', () => {
    it('스케줄을 찾으면 반환해야 한다.', async () => {
      const mockSchedule = new Schedule({
        id: 1,
        concertId: 101,
        date: new Date('2023-12-01T18:00:00Z'),
        seats: [], //
        maximum: 100,
        count: 10,
        createdAt: new Date('2023-10-01T10:00:00Z'),
        updatedAt: new Date('2023-10-01T10:00:00Z'),
        deletedAt: null,
      });
      jest.spyOn(scheduleRepository, 'findOne').mockResolvedValue(mockSchedule);

      const result = await concertService.findSchedule(1);
      expect(scheduleRepository.findOne).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });

    it('스케줄이 없으면 예외를 던져야 한다.', async () => {
      jest.spyOn(scheduleRepository, 'findOne').mockResolvedValue(null);

      await expect(concertService.findSchedule(1)).rejects.toThrow(
        new BadRequestException('없는 스케줄 입니다. id: 1'),
      );
    });
  });
});
