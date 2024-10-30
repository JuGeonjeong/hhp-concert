import User from 'src/domain/user/domain/entity/user.entity';
import { Seat } from '../../domain/entity/seat';
import SeatEntity, { SeatStatusEnum } from '../entity/seat.typeorm.entity';

export class SeatMapper {
  static toDomain(entity: SeatEntity, user: User): Seat {
    return new Seat({
      id: entity.id,
      seatNumber: entity.seatNumber,
      expiredAt: entity.expiredAt,
      price: entity.price,
      status: entity.status,
      isReserved: entity.status === SeatStatusEnum.RESERVED ? true : false,
      userInfo: user,
    });
  }

  static toEntity(seat: Seat): SeatEntity {
    const entity = new SeatEntity();
    entity.id = seat.id;
    entity.price = seat.price;
    return entity;
  }
}
