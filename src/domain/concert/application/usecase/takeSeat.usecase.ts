import { Inject } from '@nestjs/common';
import { SeatReservDto } from '../../interface/dto/req/seatReserv.dto';
import { ConcertService } from '../../domain/service/concert.service';

export class TakeSeatUsecase {
  constructor(
    @Inject(ConcertService)
    private readonly concertService: ConcertService,
  ) {}

  async reservationSeat(body: SeatReservDto) {
    return await this.concertService.create(body);
  }
}
