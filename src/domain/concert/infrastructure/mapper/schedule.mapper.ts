import { Schedule } from '../../domain/entity/schedule';
import ScheduleEntity from '../entity/schedule.entity';

export class ScheduleMapper {
  static toDomain(entity: ScheduleEntity): Schedule {
    return new Schedule({
      id: entity.id,
      concertId: entity.concertId,
      date: entity.date,
      maximum: entity.maximum,
      count: entity.count,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    });
  }

  static toEntity(schedule: Schedule): ScheduleEntity {
    const entity = new ScheduleEntity();
    entity.id = schedule.id;
    entity.concertId = schedule.concertId;
    entity.date = schedule.date;
    entity.maximum = schedule.maximum;
    entity.count = schedule.count;
    return entity;
  }
}
