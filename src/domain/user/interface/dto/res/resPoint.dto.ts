import { ApiProperty } from '@nestjs/swagger';

export class ResPointDto {
  @ApiProperty({ description: '유저' })
  readonly userId: number;

  @ApiProperty({ description: '보유금' })
  readonly amount: number;

  constructor(data: any) {
    this.userId = data.userId;
    this.amount = data.amount;
  }
}
