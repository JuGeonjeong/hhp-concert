import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConcertRepository } from '../repository/concertRepository';
import { ScheduleRepository } from '../repository/scheduleRepository';
import { SeatRepository } from '../repository/seatRepository';
import Seat from '../../infrastructure/entity/seat.typeorm.entity';

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

  // concertRepository
  async findConcert(id: number) {
    const concert = await this.concertRepository.findOne(id);
    if (concert) {
      return concert;
    } else {
      throw new BadRequestException(`없는 콘서트 입니다. id: ${id}`);
    }
  }

  // scheduleRepository
  async findSchedules(id: number) {
    const schedules = await this.scheduleRepository.findSchedules(id);
    if (schedules) {
      return schedules;
    } else {
      throw new BadRequestException(`콘서트 일정이 없습니다.`);
    }
  }

  async findSchedule(id: number) {
    const schedule = await this.scheduleRepository.findOne(id);
    if (!schedule) {
      throw new BadRequestException(`없는 스케줄 입니다. id: ${id}`);
    }
  }

  // seatsRepository
  async create(body) {
    return await this.seatsRepository.create(body);
  }

  async cancelSeat(body) {
    const exSeat = await this.seatsRepository.exSeat(body);
    if (exSeat) {
      await this.seatsRepository.cancel(exSeat.seatNumber);
    }
    return exSeat;
  }

  async findOne(id) {
    const data = await this.seatsRepository.findOne(id);
    if (!data) {
      throw new BadRequestException(`없는 좌석 입니다. id: ${id}`);
    }
    console.log(data);
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

  async updateStatus(seat: Seat) {
    return await this.seatsRepository.update(seat);
  }
}
