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
    const data = await this.concertService.create(body);
    await this.userService.createUser(body);
    return data;
  }
}
