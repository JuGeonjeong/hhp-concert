import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class SeatReservDto {
  @ApiProperty({ description: '유저 고유키' })
  @IsNotEmpty()
  @IsInt()
  readonly userId: number;

  @ApiProperty({ description: '스케줄 고유키' })
  @IsNotEmpty()
  @IsInt()
  readonly scheduleId: number;

  @ApiProperty({ description: '좌석번호', example: 1 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(50)
  readonly seatNumber: number;
}
