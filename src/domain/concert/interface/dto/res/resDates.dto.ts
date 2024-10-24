import { ApiProperty } from '@nestjs/swagger';
import * as dayjs from 'dayjs';
import Schedule from '../../../domain/entity/schedule.entity';

export class ResDatesDto {
  @ApiProperty({ description: '콘서트고유키', example: 1 })
  readonly concertId: number;

  @ApiProperty({ description: '스케줄고유키', example: 1 })
  readonly scheduleId: number;

  @ApiProperty({ description: '날짜', example: 1 })
  readonly date: string;

  constructor(schedule: Schedule) {
    this.scheduleId = schedule.id;
    this.date = dayjs(schedule.date).format('YYYY-MM-DD');
  }
}
