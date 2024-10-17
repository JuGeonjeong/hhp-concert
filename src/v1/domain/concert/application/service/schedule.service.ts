import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ScheduleRepository } from '../../domain/repository/scheduleRepository';
import { SeatRepository } from '../../domain/repository/seatRepository';

@Injectable()
export class ScheduleService {
  constructor(
    @Inject('IScheduleRepository')
    private readonly scheduleRepository: ScheduleRepository,
    @Inject('ISeatRepository')
    private readonly seatsRepository: SeatRepository,
  ) {}

  async findSchedule(id: number) {
    const schedule = await this.scheduleRepository.findOne(id);
    if (!schedule) {
      throw new BadRequestException(`없는 스케줄 입니다. id: ${id}`);
    }
  }
}
