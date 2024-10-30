import Schedule from '../../infrastructure/entity/schedule.typeorm.entity';

export interface ScheduleRepository {
  findOne(id: number): Promise<Schedule>;
  findSchedules(id: number): Promise<Schedule[] | []>;
}
