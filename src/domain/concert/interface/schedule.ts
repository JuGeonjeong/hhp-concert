import { Injectable } from '@nestjs/common';
import { ConcertService } from '../application/service/concert.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ReservationExpiryScheduler {
  constructor(private readonly concertService: ConcertService) {}

  // 매 1분마다 만료된 예약을 처리
  @Cron('*/1 * * * *')
  async handleReservationExpiry(): Promise<void> {
    // await this.concertService.expireReservations();
  }
}
