import { Inject } from '@nestjs/common';
import { ConcertService } from '../service/concert.service';
import { SeatReservDto } from '../../interface/dto/req/seatReserv.dto';
import { UserService } from 'src/domain/user/application/service/user.service';

export class TakeSeatUsecase {
  constructor(
    @Inject(ConcertService)
    private readonly concertService: ConcertService,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async reservationSeat(body: SeatReservDto) {
    await this.userService.findOne(body.userId);
    const data = await this.concertService.create(body);
    return data;
  }
}
