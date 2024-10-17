import { Inject } from '@nestjs/common';
import { SeatService } from '../service/seat.service';

export class TakeSeat {
  constructor(
    @Inject(SeatService)
    private readonly seatService: SeatService,
  ) {}

  async reserv(body) {
    await this.seatService.cancelSeat(body);
    return await this.seatService.create(body);
  }
}
