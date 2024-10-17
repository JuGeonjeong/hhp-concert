import Seat from '../entity/seat.entity';

export interface SeatRepository {
  // 임시예약
  create(data): Promise<Seat>;
  // 5분지난 예약 자리 찾기
  exSeat(data): Promise<Seat>;
  // 임시예약 취소
  cancel(seatNumber: number): Promise<Seat>;
  // 좌석검색
  findSeats(id: number): Promise<Seat[] | []>;
}
