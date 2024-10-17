import { Test, TestingModule } from '@nestjs/testing';
import { SeatService } from './seat.service';
import { SeatRepository } from '../../domain/repository/seatRepository';
import { BadRequestException } from '@nestjs/common';
import Seat from '../../domain/entity/seat.entity';

describe('SeatService', () => {
  let seatService: SeatService;
  let seatRepository: SeatRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeatService,
        {
          provide: 'ISeatRepository',
          useValue: {
            create: jest.fn(),
            exSeat: jest.fn(),
            cancel: jest.fn(),
            findOne: jest.fn(),
            findSeats: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    seatService = module.get<SeatService>(SeatService);
    seatRepository = module.get<SeatRepository>('ISeatRepository');
  });

  it('', () => {
    expect(seatService).toBeDefined();
  });

  describe('create', () => {
    it('좌석을 생성해야 한다.', async () => {
      const seatDto = { seatNumber: 1 };
      const createdSeat = new Seat();
      jest.spyOn(seatRepository, 'create').mockResolvedValue(createdSeat);

      const result = await seatService.create(seatDto);

      expect(seatRepository.create).toHaveBeenCalledWith(seatDto);
      expect(result).toEqual(createdSeat);
    });
  });

  describe('cancelSeat', () => {
    it('좌석을 취소해야 한다.', async () => {
      const seatDto = { seatNumber: 1 };
      const exSeat = new Seat();
      exSeat.seatNumber = 1;

      jest.spyOn(seatRepository, 'exSeat').mockResolvedValue(exSeat);
      jest.spyOn(seatRepository, 'cancel').mockResolvedValue(undefined);

      const result = await seatService.cancelSeat(seatDto);

      expect(seatRepository.exSeat).toHaveBeenCalledWith(seatDto);
      expect(seatRepository.cancel).toHaveBeenCalledWith(exSeat.seatNumber);
      expect(result).toEqual(exSeat);
    });

    it('좌석이 없으면 취소하지 않습니다', async () => {
      const seatDto = { seatNumber: 1 };
      jest.spyOn(seatRepository, 'exSeat').mockResolvedValue(null);

      const result = await seatService.cancelSeat(seatDto);

      expect(seatRepository.exSeat).toHaveBeenCalledWith(seatDto);
      expect(seatRepository.cancel).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('findOne', () => {
    it('좌석을 조회해야 한다.', async () => {
      const seatId = 1;
      const foundSeat = new Seat();
      jest.spyOn(seatRepository, 'findOne').mockResolvedValue(foundSeat);

      const result = await seatService.findOne(seatId);

      expect(seatRepository.findOne).toHaveBeenCalledWith(seatId);
      expect(result).toEqual(foundSeat);
    });
  });

  describe('findSeats', () => {
    it('좌석이 없으면 예외를 던져야 한다.', async () => {
      const scheduleId = 1;
      jest.spyOn(seatRepository, 'findSeats').mockResolvedValue(null);

      await expect(seatService.findSeats(scheduleId)).rejects.toThrow(
        new BadRequestException(`없는 스케줄 입니다. id: ${scheduleId}`),
      );
    });

    // it('빈 좌석을 반환해야 한다.', async () => {
    //   // const totalSeat = 10
    //   const scheduleId = 1;
    //   const seats = [{ seatNumber: 1 }, { seatNumber: 2 }];
    //   jest.spyOn(seatRepository, 'findSeats').mockResolvedValue(seats);

    //   const result = await seatService.findSeats(scheduleId);

    //   expect(seatRepository.findSeats).toHaveBeenCalledWith(scheduleId);
    //   expect(result).toEqual([3, 4, 5, 6, 7, 8, 9, 10]); // 예시 빈 좌석
    // });
  });

  describe('updateStatus', () => {
    it('좌석 상태를 업데이트해야 한다.', async () => {
      const seat = new Seat();
      jest.spyOn(seatRepository, 'update').mockResolvedValue(seat);

      const result = await seatService.updateStatus(seat);

      expect(seatRepository.update).toHaveBeenCalledWith(seat);
      expect(result).toEqual(seat);
    });
  });
});
