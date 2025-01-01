export const ConcertFacade = Symbol('ConcertFacade');

export interface ConcertFacade {
  findDates(concertId: any): Promise<any>;
  findSeats(scheduleId: any): Promise<any>;
  reservationSeat(aggregate: any): Promise<any>;
}
