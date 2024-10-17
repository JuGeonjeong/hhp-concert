import Schedule from '../entity/schedule.entity';

export interface ScheduleRepository {
  findOne(id: number): Promise<Schedule>;
  findSchedules(id: number): Promise<Schedule[] | []>;
}
