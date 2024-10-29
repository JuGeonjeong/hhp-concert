import { Inject } from '@nestjs/common';
import { ConcertService } from '../../domain/service/concert.service';

export class TakeSeatUsecase {
  constructor(
    @Inject(ConcertService)
    private readonly concertService: ConcertService,
  ) {}

  async reserv(body) {
    await this.concertService.cancelSeat(body);
    return await this.concertService.create(body);
  }
}
