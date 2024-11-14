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

    // 낙관적락
    // 좌석 조회 후 좌석 예약, 나머지 처리는 에러 반환
    return await this.manager.transaction(async (transactional) => {
      const existingSeat = await transactional.findOne(SeatEntity, {
        where: { scheduleId, seatNumber },
      });

      if (existingSeat) {
        throw new Error('이미 예약된 좌석입니다.');
      }

      const seat = new Seat({
        userId,
        scheduleId,
        seatNumber,
        expiredAt,
      });
      console.log(seat);

      try {
        const entity = await transactional.save(seat);
        return SeatMapper.toDomain(entity);
      } catch (error) {
        if (error.name === 'OptimisticLockVersionMismatchError') {
          throw new Error('좌석 예약 충돌이 발생했습니다.');
        }
        throw error;
      }
    });
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
    const SeatEntity = await this.manager.save(entity);
    return SeatMapper.toDomain(SeatEntity);
  }

  // 좌석 찾기
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

  // 비관적락
  // 임시예약된 좌석 중 만료시간 지난 좌석 조회 후 상태변경
  async expireReservations(): Promise<void> {
    const now = dayjs().toDate();
    await this.manager.transaction(async (transactionalEntityManager) => {
      const expiredSeats = await transactionalEntityManager
        .createQueryBuilder(SeatEntity, 'seat')
        .setLock('pessimistic_write')
        .where('seat.status = :status', { status: SeatStatusEnum.AVAILABLE })
        .andWhere('seat.expiredAt < :now', { now })
        .getMany();

      for (const seat of expiredSeats) {
        seat.status = SeatStatusEnum.CANCEL;
        // seat.expiredAt = null;
        await transactionalEntityManager.save(seat);
      }
    });
  }
}
