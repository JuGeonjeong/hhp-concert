import { NotFoundException404 } from 'src/common/exception/not.found.exception.404';
import { Concert } from 'src/domain/concert/domain/entity/concert';
import { Schedule } from 'src/domain/concert/domain/entity/schedule';
import { Seat } from 'src/domain/concert/domain/entity/seat';
import { ConcertRepository } from 'src/domain/concert/domain/repository/concertRepository';
import { ScheduleRepository } from 'src/domain/concert/domain/repository/scheduleRepository';
import { SeatRepository } from 'src/domain/concert/domain/repository/seatRepository';
import { ConcertService } from 'src/domain/concert/domain/service/concert.service';
import { SeatStatusEnum } from 'src/domain/concert/infrastructure/entity/seat.entity';
import { SeatReservDto } from 'src/domain/concert/interface/dto/req/seatReserv.dto';

describe('ConcertService unit test', () => {
  let concertService: ConcertService;
  let mockConcertRepository: jest.Mocked<ConcertRepository>;
  let mockScheduleRepository: jest.Mocked<ScheduleRepository>;
  let mockSeatRepository: jest.Mocked<SeatRepository>;

  beforeEach(() => {
    mockConcertRepository = {
      findOne: jest.fn(),
    } as unknown as jest.Mocked<ConcertRepository>;
    mockScheduleRepository = {
      findOne: jest.fn(),
      findSchedules: jest.fn(),
    } as unknown as jest.Mocked<ScheduleRepository>;
    mockSeatRepository = {
      create: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      cancel: jest.fn(),
      findSeats: jest.fn(),
      expireReservations: jest.fn(),
    } as unknown as jest.Mocked<SeatRepository>;

    concertService = new ConcertService(
      mockConcertRepository,
      mockScheduleRepository,
      mockSeatRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('ConcertService가 정의되어 있어야 한다.', () => {
    expect(concertService).toBeDefined();
  });

  describe('findConcert', () => {
    it('concertId로 조회 후 올바른 값을 반환한다.', async () => {
      const concertId = 1;
      const mockConcert = new Concert({
        id: 1,
        name: '뉴진스 콘서트',
        createdAt: new Date(),
      });
      mockConcertRepository.findOne.mockResolvedValue(mockConcert);
      const result = await concertService.findConcert(concertId);

      expect(mockConcertRepository.findOne).toHaveBeenCalledWith(concertId);
      expect(result).toEqual(mockConcert);
    });
    it('concertId로 조회 후 값이 없는경우 404에러를 반환한다.', async () => {
      const concertId = 999;
      mockConcertRepository.findOne.mockResolvedValue(null);
      await expect(concertService.findConcert(concertId)).rejects.toThrow(
        new NotFoundException404(`없는 콘서트 입니다. id: ${concertId}`),
      );
    });
  });

  describe('findSchedules', () => {
    it('concertId로 스케줄들을 조회 후 반환합니다.', async () => {
      const concertId = 1;
      const mockSchedules = [
        new Schedule({
          scheduleId: 1,
          date: new Date('2024-10-18'),
        }),
        new Schedule({
          scheduleId: 2,
          date: new Date('2024-12-19'),
        }),
      ];
      mockScheduleRepository.findSchedules.mockResolvedValue(mockSchedules);
      const result = await concertService.findSchedules(concertId);

      expect(mockScheduleRepository.findSchedules).toHaveBeenCalledWith(
        concertId,
      );
      expect(result).toEqual(mockSchedules);
    });
    it('concertId로 조회 후 스케줄값들이 없는경우 404에러를 반환한다.', async () => {
      const concertId = 999;
      mockScheduleRepository.findSchedules.mockResolvedValue(null);
      await expect(concertService.findSchedules(concertId)).rejects.toThrow(
        new NotFoundException404(`콘서트 일정이 없습니다.`),
      );
    });
  });

  describe('findSchedule', () => {
    it('scheduleId로 스케줄을 조회 후 반환합니다.', async () => {
      const scheduleId = 1;
      const mockSchedule = new Schedule({
        id: 1,
        scheduleId: 1,
        concertId: 1,
        date: new Date(),
        seats: [],
        maximum: 50,
        count: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });
      mockScheduleRepository.findOne.mockResolvedValue(mockSchedule);
      const result = await concertService.findSchedule(scheduleId);

      expect(mockScheduleRepository.findOne).toHaveBeenCalledWith(scheduleId);
      expect(result).toEqual(mockSchedule);
    });
    it('scheduleId로 조회 후 스케줄값이 없는경우 404에러를 반환한다.', async () => {
      const concertId = 999;
      mockScheduleRepository.findOne.mockResolvedValue(null);
      await expect(concertService.findSchedule(concertId)).rejects.toThrow(
        new NotFoundException404(`없는 스케줄 입니다. id: ${concertId}`),
      );
    });
  });
  describe('create', () => {
    it('성공적으로 좌석을 생성하고 반환한다.', async () => {
      const body: SeatReservDto = {
        userId: 1,
        scheduleId: 1,
        seatNumber: 1,
      };
      const mockSeat = new Seat({
        scheduleId: 1,
        userId: 1,
        expiredAt: new Date(),
        seatNumber: 1,
      });
      mockSeatRepository.create.mockResolvedValue(mockSeat);
      const result = await concertService.create(body);

      expect(mockSeatRepository.create).toHaveBeenCalledWith(body);
      expect(result).toEqual(mockSeat);
    });
  });

  describe('findOne', () => {
    it('seatId로 좌석을 조회하고 반환한다.', async () => {
      const seatId = 1;
      const mockSeat = new Seat({
        scheduleId: 1,
        userId: 1,
        expiredAt: new Date(),
        seatNumber: 1,
      });
      mockSeatRepository.findOne.mockResolvedValue(mockSeat);

      const result = await concertService.findOne(seatId);

      expect(mockSeatRepository.findOne).toHaveBeenCalledWith(seatId);
      expect(result).toEqual(mockSeat);
    });
    it('scheduleId로 조회 후 스케줄값이 없는경우 404에러를 반환한다.', async () => {
      const seatId = 999;
      mockSeatRepository.findOne.mockResolvedValue(null);
      await expect(concertService.findOne(seatId)).rejects.toThrow(
        new NotFoundException404(`없는 좌석 입니다. id: ${seatId}`),
      );
    });
  });
  describe('findSeats', () => {
    it('50개의 좌석 중 scheduleId로 조회된 좌석들은 제외하고 반환한다.', async () => {
      const scheduleId = 1;
      const mockSeats = [
        new Seat({
          scheduleId: 1,
          userId: 1,
          expiredAt: new Date(),
          seatNumber: 1,
        }),
        new Seat({
          scheduleId: 1,
          userId: 2,
          expiredAt: new Date(),
          seatNumber: 2,
        }),
      ];

      const haveSeats = mockSeats?.map((v: any) => v.seatNumber);
      const expectedAvailableSeats = Array.from(
        { length: 50 },
        (_, i) => i + 1,
      ).filter((seat) => !haveSeats.includes(seat));

      mockSeatRepository.findSeats.mockResolvedValue(mockSeats);

      const result = await concertService.findSeats(scheduleId);

      expect(mockSeatRepository.findSeats).toHaveBeenCalledWith(scheduleId);
      expect(result).toEqual(expectedAvailableSeats);
    });
    it('스케줄 ID로 조회된 좌석이 없을 경우 예외를 던진다.', async () => {
      const scheduleId = 2;
      mockSeatRepository.findSeats.mockResolvedValue(null);

      await expect(concertService.findSeats(scheduleId)).rejects.toThrow(
        new NotFoundException404(`없는 스케줄 입니다. id: ${scheduleId}`),
      );

      expect(mockSeatRepository.findSeats).toHaveBeenCalledWith(scheduleId);
    });
  });
  describe('update', () => {
    it('성공적으로 데이터를 수정하고 반환한다.', async () => {
      const exSeat = new Seat({
        scheduleId: 1,
        userId: 1,
        expiredAt: new Date(),
        seatNumber: 1,
        status: SeatStatusEnum.CANCEL,
      });

      mockSeatRepository.update.mockResolvedValue(exSeat);
      const result = await concertService.update(exSeat);

      expect(mockSeatRepository.update).toHaveBeenCalledWith(exSeat);
      expect(result).toEqual(exSeat);
      expect(result.status).toEqual(SeatStatusEnum.CANCEL);
    });
  });
});
