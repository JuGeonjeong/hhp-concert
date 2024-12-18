import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConcertRepository } from '../../domain/repository/concertRepository';
import { ScheduleRepository } from '../../domain/repository/scheduleRepository';
import { SeatRepository } from '../../domain/repository/seatRepository';
import { Seat } from '../../domain/entity/seat';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ConcertService {
  constructor(
    @Inject('IConcertRepository')
    private readonly concertRepository: ConcertRepository,
    @Inject('IScheduleRepository')
    private readonly scheduleRepository: ScheduleRepository,
    @Inject('ISeatRepository')
    private readonly seatsRepository: SeatRepository,
  ) {}

  /**
   * 콘서트 조회 합니다.
   */
  async findConcert(id: number) {
    const concert = await this.concertRepository.findOne(id);
    if (concert) {
      return concert;
    } else {
      throw new BadRequestException(`없는 콘서트 입니다. id: ${id}`);
    }
  }

  /**
   * 콘서트의 날짜를 조회 합니다.
   */
  async findSchedules(concertId: number) {
    const schedules = await this.scheduleRepository.findSchedules(concertId);
    if (schedules) {
      return schedules;
    } else {
      throw new BadRequestException(`콘서트 일정이 없습니다.`);
    }
  }

  /**
   * 콘서트 스케줄을 합니다.
   */
  async findSchedule(id: number) {
    const schedule = await this.scheduleRepository.findOne(id);
    if (!schedule) {
      throw new BadRequestException(`없는 스케줄 입니다. id: ${id}`);
    }
  }

  /**
   * 새로운 좌석을 생성합니다.
   */
  async create(body) {
    return await this.seatsRepository.create(body);
  }

  /**
   * 좌석의 정보를 조회합니다.
   */
  async findOne(id) {
    const data = await this.seatsRepository.findOne(id);
    if (!data) {
      throw new BadRequestException(`없는 좌석 입니다. id: ${id}`);
    }
    return data;
  }

  async findSeats(id: number) {
    const seats = await this.seatsRepository.findSeats(id);
    if (!seats) {
      throw new BadRequestException(`없는 스케줄 입니다. id: ${id}`);
    }
    const haveSeats = seats?.map((v) => v.seatNumber);
    console.log(haveSeats);
    const emptySeats = await this.getAvailableSeats(haveSeats);
    return emptySeats;
  }

  async getAvailableSeats(data: number[]): Promise<number[]> {
    const totalSeats = Array.from({ length: 50 }, (_, i) => i + 1);
    const availableSeats = totalSeats.filter((seat) => !data.includes(seat));
    return availableSeats;
  }

  async update(seat: Seat) {
    return await this.seatsRepository.update(seat);
  }

  // 매 1분마다 만료된 예약을 처리
  @Cron('*/1 * * * *')
  async handleReservationExpiry(): Promise<void> {
    // await this.seatsRepository.expireReservations();
  }
}
