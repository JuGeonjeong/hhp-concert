import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ScheduleRepository } from '../domain/repository/scheduleRepository';
import Schedule from '../domain/entity/schedule.entity';

@Injectable()
export class ScheduleRepositoryImpl implements ScheduleRepository {
  constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

  async findOne(id: number): Promise<Schedule> {
    return await this.manager.findOne(Schedule, {
      where: { id },
    });
  }

  async findSchedules(concertId: number): Promise<Schedule[]> {
    return await this.manager.find(Schedule, {
      where: { concertId },
    });
  }
}
