import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, LessThan, MoreThan } from 'typeorm';
import * as dayjs from 'dayjs';
import { Seat } from '../../domain/entity/seat';
import { SeatRepository } from '../../domain/repository/seatRepository';
import SeatEntity, { SeatStatusEnum } from '../entity/seat.entity';
import { SeatMapper } from '../mapper/seat.mapper';

@Injectable()
export class SeatRepositoryImpl implements SeatRepository {
  constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

  async create(data): Promise<Seat> {
    const { userId, scheduleId, seatNumber } = data;
    const expiredAt = dayjs().add(5, 'minute').toDate();
    const seat = this.manager.create(SeatEntity, {
      userId,
      scheduleId,
      expiredAt,
      seatNumber,
    });
    const entity = await this.manager.save(seat);
    return SeatMapper.toDomain(entity);
  }

  async exSeat(data: any): Promise<Seat> {
    const now = dayjs().toDate();
    const entity = await this.manager.findOne(SeatEntity, {
      where: {
        seatNumber: data.seatNumber,
        status: SeatStatusEnum.AVAILABLE,
        expiredAt: LessThan(now),
      },
    });
    return SeatMapper.toDomain(entity);
  }

  async cancel(seatNumber: number): Promise<Seat> {
    await this.manager.update(
      SeatEntity,
      { seatNumber },
      { status: SeatStatusEnum.CANCEL },
    );
    const entity = await this.manager.findOne(SeatEntity, {
      where: { seatNumber },
    });
    return SeatMapper.toDomain(entity);
  }

  async findOne(id: number): Promise<Seat> {
    const entity = await this.manager.findOne(SeatEntity, {
      where: {
        id,
      },
    });
    return SeatMapper.toDomain(entity);
  }

  async update(seat: Seat): Promise<Seat> {
    const entity = SeatMapper.toEntity(seat);
    entity.status = SeatStatusEnum.RESERVED;
    const SeatEntity = await this.manager.save(seat);
    return SeatMapper.toDomain(SeatEntity);
  }

  async findSeats(scheduleId: number): Promise<Seat[]> {
    const now = dayjs().toDate();
    const entities = await this.manager.find(SeatEntity, {
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
    return entities.map(SeatMapper.toDomain);
  }
}
