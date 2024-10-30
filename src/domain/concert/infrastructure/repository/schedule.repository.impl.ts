import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Schedule } from '../../domain/entity/schedule';
import ScheduleEntity from '../entity/schedule.entity';
import { ScheduleMapper } from '../mapper/schedule.mapper';

@Injectable()
export class ScheduleRepositoryImpl implements ScheduleRepositoryImpl {
  constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

  async findOne(id: number): Promise<Schedule> {
    const entity = await this.manager.findOne(ScheduleEntity, {
      where: { id },
    });
    return ScheduleMapper.toDomain(entity);
  }

  async findSchedules(concertId: number): Promise<Schedule[]> {
    const entities = await this.manager.find(ScheduleEntity, {
      where: { concertId },
    });
    return entities.map(ScheduleMapper.toDomain);
  }
}
