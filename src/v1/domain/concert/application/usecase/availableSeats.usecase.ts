import { Inject } from '@nestjs/common';
import { ScheduleService } from '../service/schedule.service';
import { SeatService } from '../service/seat.service';

export class AvailableSeats {
  constructor(
    @Inject(ScheduleService)
    private readonly scheduleService: ScheduleService,
    @Inject(SeatService)
    private readonly seatService: SeatService,
  ) {}

  async findSeats(id: number) {
    await this.scheduleService.findSchedule(id);
    return await this.seatService.findSeats(id);
  }
}
