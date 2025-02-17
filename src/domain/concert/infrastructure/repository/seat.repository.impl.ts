import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, MoreThan } from 'typeorm';
import * as dayjs from 'dayjs';
import { Seat } from '../../domain/entity/seat';
import { SeatRepository } from '../../domain/repository/seatRepository';
import SeatEntity, { SeatStatusEnum } from '../entity/seat.entity';
import { SeatMapper } from '../mapper/seat.mapper';
import { BadRequestException400 } from 'src/common/exception/bad.request.exception.400';

@Injectable()
export class SeatRepositoryImpl implements SeatRepository {
  constructor(@InjectEntityManager() private readonly manager: EntityManager) {}

  async create(dto: any): Promise<Seat> {
    const { userId, scheduleId, seatNumber } = dto;
    const expiredAt = dayjs().add(5, 'minute').toDate();

    return await this.manager.transaction(async (transactional) => {
      const exSeat = await transactional.findOne(SeatEntity, {
        where: { scheduleId, seatNumber },
        lock: { mode: 'optimistic', version: 1 },
      });

      // 좌석이 없는 경우 새로 생성
      if (!exSeat) {
        const newSeat = SeatMapper.toEntity({
          userId,
          scheduleId,
          seatNumber,
          expiredAt,
          version: 1,
        });
        const entity = await transactional.save(newSeat);
        return SeatMapper.toDomain(entity);
      }

      // 예약된 상태인 경우 처리
      if (
        exSeat.status === SeatStatusEnum.PENDING ||
        exSeat.status === SeatStatusEnum.RESERVED
      ) {
        throw new BadRequestException400('이미 예약된 좌석입니다.');
      }

      // 기존 좌석의 상태 업데이트
      exSeat.userId = userId;
      exSeat.expiredAt = expiredAt;
      exSeat.version += 1;
      const updatedSeat = await transactional.save(exSeat);

      return SeatMapper.toDomain(updatedSeat);
    });
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
          status: SeatStatusEnum.PENDING,
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
        .where('seat.status = :status', { status: SeatStatusEnum.PENDING })
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
