import SeatEntity, { SeatStatusEnum } from '../entity/seat.entity';
import { Seat } from '../../domain/entity/seat';

export class SeatMapper {
  static toDomain(entity: Partial<SeatEntity>): Seat {
    return new Seat({
      id: entity.id,
      scheduleId: entity.scheduleId,
      userId: entity.userId,
      seatNumber: entity.seatNumber,
      expiredAt: entity.expiredAt,
      price: entity.price,
      status: entity.status,
      version: entity.version,
      isReserved: entity.status === SeatStatusEnum.RESERVED ? true : false,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt || null,
    });
  }

  static toEntity(seat: Partial<Seat>): SeatEntity {
    const entity = new SeatEntity();
    entity.id = seat.id;
    entity.userId = seat.userId;
    entity.scheduleId = seat.scheduleId;
    entity.seatNumber = seat.seatNumber;
    entity.expiredAt = seat.expiredAt;
    return entity;
  }
}
