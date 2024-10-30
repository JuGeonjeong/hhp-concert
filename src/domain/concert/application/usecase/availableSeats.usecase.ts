import { Inject } from '@nestjs/common';
import { ConcertService } from '../service/concert.service';

export class AvailableSeatsUsecase {
  constructor(
    @Inject(ConcertService)
    private readonly concertService: ConcertService,
  ) {}

  async findSeats(id: number) {
    await this.concertService.findSchedule(id);
    return await this.concertService.findSeats(id);
  }
}
