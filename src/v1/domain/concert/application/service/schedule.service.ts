import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ScheduleRepository } from '../../domain/repository/scheduleRepository';

@Injectable()
export class ScheduleService {
  constructor(
    @Inject('IScheduleRepository')
    private readonly scheduleRepository: ScheduleRepository,
  ) {}

  async findSchedule(id: number) {
    const schedule = await this.scheduleRepository.findOne(id);
    if (!schedule) {
      throw new BadRequestException(`없는 스케줄 입니다. id: ${id}`);
    }
  }
}
