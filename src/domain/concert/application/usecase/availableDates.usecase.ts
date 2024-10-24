import { Inject } from '@nestjs/common';
import { ConcertService } from '../service/concert.service';

export class AvailableDatesUsecase {
  constructor(
    @Inject(ConcertService)
    private readonly concertService: ConcertService,
  ) {}

  async findDates(concertId: number) {
    await this.concertService.findConcert(concertId);
    return await this.concertService.findSchedules(concertId);
  }
}
