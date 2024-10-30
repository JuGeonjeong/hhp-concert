import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, LessThan, MoreThan } from 'typeorm';
import { SeatRepository } from '../../domain/repository/seatRepository';
import Seat, { SeatStatusEnum } from '../entity/seat.typeorm.entity';
import * as dayjs from 'dayjs';

@Injectable()
export class SeatRepositoryImpl implements SeatRepository {
  constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

  async create(data): Promise<Seat> {
    const { userId, scheduleId, seatNumber } = data;
    const expiredAt = dayjs().add(5, 'minute').toDate();
    console.log(expiredAt);
    const seat = this.manager.create(Seat, {
      userId,
      scheduleId,
      expiredAt,
      seatNumber,
    });
    return await this.manager.save(seat);
  }

  async exSeat(data: any): Promise<Seat> {
    const now = dayjs().toDate();
    return await this.manager.findOne(Seat, {
      where: {
        seatNumber: data.seatNumber,
        status: SeatStatusEnum.AVAILABLE,
        expiredAt: LessThan(now),
      },
    });
  }

  async cancel(seatNumber: number): Promise<Seat> {
    await this.manager.update(
      Seat,
      { seatNumber },
      { status: SeatStatusEnum.CANCEL },
    );
    return await this.manager.findOne(Seat, { where: { seatNumber } });
  }

  async findOne(id: number): Promise<Seat> {
    return await this.manager.findOne(Seat, {
      where: {
        id,
      },
    });
  }

  async update(seat: Seat): Promise<Seat> {
    seat.status = SeatStatusEnum.RESERVED;
    return await this.manager.save(seat);
  }

  async findSeats(scheduleId: number): Promise<Seat[]> {
    const now = dayjs().toDate();
    return await this.manager.find(Seat, {
      where: [
        {
          scheduleId,
          status: SeatStatusEnum.AVAILABLE,
          expiredAt: MoreThan(now),
        },
        {
          scheduleId,
          status: SeatStatusEnum.RESERVED,
        },
      ],
    });
  }
}
