import { ApiProperty } from '@nestjs/swagger';
import { Point } from 'src/domain/user/domain/entity/point';
import { User } from 'src/domain/user/domain/entity/user';

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
