import { Inject } from '@nestjs/common';
import { ConcertFacade } from './concert.facade';
import { AvailableDatesUsecase } from './usecase/availableDates.usecase';
import { AvailableSeatsUsecase } from './usecase/availableSeats.usecase';
import { TakeSeatUsecase } from './usecase/takeSeat.usecase';

export class ConcertFacadeImpl implements ConcertFacade {
  constructor(
    @Inject(AvailableDatesUsecase)
    private readonly availableDatesUsecase: AvailableDatesUsecase,
    @Inject(AvailableSeatsUsecase)
    private readonly availableSeatsUsecase: AvailableSeatsUsecase,
    @Inject(TakeSeatUsecase)
    private readonly takeSeatUsecase: TakeSeatUsecase,
  ) {}

  /**
   * @see {ConcertFacade.findDates}
   */
  findDates(concertId: any): Promise<any> {
    return this.availableDatesUsecase.findDates(concertId);
  }

  /**
   * @see {ConcertFacade.findSeats}
   */
  findSeats(scheduleId: any): Promise<any> {
    return this.availableSeatsUsecase.findSeats(scheduleId);
  }

  /**
   * @see {ConcertFacade.reservationSeat}
   */
  reservationSeat(aggregate: any): Promise<any> {
    return this.takeSeatUsecase.reservationSeat(aggregate);
  }
}
