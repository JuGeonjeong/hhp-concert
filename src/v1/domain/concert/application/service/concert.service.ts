import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConcertRepository } from '../../domain/repository/concertRepository';
import { ScheduleRepository } from '../../domain/repository/scheduleRepository';

@Injectable()
export class ConcertService {
  constructor(
    @Inject('IConcertRepository')
    private readonly concertRepository: ConcertRepository,
    @Inject('IScheduleRepository')
    private readonly scheduleRepository: ScheduleRepository,
  ) {}

  async findConcert(id: number) {
    const concert = await this.concertRepository.findOne(id);
    if (concert) {
      return concert;
    } else {
      throw new BadRequestException(`없는 콘서트 입니다. id: ${id}`);
    }
  }

  async findSchedules(concertId: number) {
    const schedules = await this.scheduleRepository.findSchedules(concertId);
    if (schedules) {
      return schedules;
    } else {
      throw new BadRequestException(`콘서트 일정이 없습니다.`);
    }
  }
}
