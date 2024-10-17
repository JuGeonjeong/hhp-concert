import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { SeatRepository } from '../../domain/repository/seatRepository';

@Injectable()
export class SeatService {
  constructor(
    @Inject('ISeatRepository')
    private readonly seatsRepository: SeatRepository,
  ) {}

  async create(body) {
    return await this.seatsRepository.create(body);
  }

  async cancelSeat(body) {
    const exSeat = await this.seatsRepository.exSeat(body);
    if (exSeat) {
      await this.seatsRepository.cancel(exSeat.seatNumber);
    }
    return exSeat;
  }

  async findSeats(id: number) {
    const seats = await this.seatsRepository.findSeats(id);
    if (!seats) {
      throw new BadRequestException(`없는 스케줄 입니다. id: ${id}`);
    }
    const haveSeats = seats?.map((v) => v.seatNumber);
    console.log(haveSeats);
    const emptySeats = await this.getAvailableSeats(haveSeats);
    return emptySeats;
  }

  async getAvailableSeats(data: number[]): Promise<number[]> {
    const totalSeats = Array.from({ length: 50 }, (_, i) => i + 1);
    const availableSeats = totalSeats.filter((seat) => !data.includes(seat));
    return availableSeats;
  }
}
