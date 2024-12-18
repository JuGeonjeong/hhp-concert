import { Inject } from '@nestjs/common';
import { ConcertService } from '../service/concert.service';

export class TakeSeatUsecase {
  constructor(
    @Inject(ConcertService)
    private readonly concertService: ConcertService,
  ) {}

  async reserv(body) {
    await this.concertService.cancelSeat(body);
    const seat = await this.concertService.create(body);
    return seat;
  }
}
