import { ApiProperty } from '@nestjs/swagger';
import Point from '../../../domain/entity/point.entity';
import User from '../../../domain/entity/user.entity';

export class ResPointDto {
  @ApiProperty({ description: '유저' })
  readonly userId: number;

  @ApiProperty({ description: '보유금' })
  readonly amount: number;

  constructor(user: User, point: Point) {
    this.userId = user.id;
    this.amount = point.amount;
  }
}
