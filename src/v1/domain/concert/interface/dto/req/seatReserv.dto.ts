import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class SeatReservDto {
  @ApiProperty({ description: '유저ID', example: 1 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  readonly userId: number;

  @ApiProperty({ description: '스케줄ID', example: 1 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  readonly scheduleId: number;

  @ApiProperty({ description: '좌석번호', example: 1 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(50)
  readonly seatNumber: number;
}
