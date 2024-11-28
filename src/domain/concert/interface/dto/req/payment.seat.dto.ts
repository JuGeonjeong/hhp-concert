import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, Min, Max } from 'class-validator';

export class PaymentSeatDto {
  @ApiProperty({ description: '유저ID', example: 1 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  readonly userId: number;

  @ApiProperty({ description: '좌석ID', example: 1 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  readonly seatId: number;

  @ApiProperty({ description: '생성일' })
  @IsNotEmpty()
  readonly createdAt: Date;

  @ApiProperty({ description: '좌석번호', example: 1 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(50)
  readonly seatNumber: number;
}
