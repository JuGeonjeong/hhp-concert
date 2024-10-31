import { Seat } from '../entity/seat';

export interface SeatRepository {
  // 임시예약
  create(data): Promise<Seat>;
  // 5분 지난 예약 자리 찾기
  exSeat(data): Promise<Seat>;
  // 자리조회
  findOne(id): Promise<Seat>;
  // 자리조회
  update(seat: Seat): Promise<Seat>;
  // 임시예약 취소
  cancel(seatNumber: number): Promise<Seat>;
  // 좌석검색
  findSeats(id: number): Promise<Seat[] | []>;
  // 만료좌석 찾기
  expireReservations(): Promise<void>;
}
