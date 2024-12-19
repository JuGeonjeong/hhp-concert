import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class OrderRequestDto {
  @ApiProperty({ description: '유저 고유키' })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ description: '좌석 고유키' })
  @IsInt()
  @IsNotEmpty()
  seatId: number;

  @ApiProperty({ description: '금액' })
  @IsInt()
  @IsNotEmpty()
  amount: number;
}
