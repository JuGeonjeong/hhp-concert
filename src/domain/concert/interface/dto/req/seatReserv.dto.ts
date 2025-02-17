import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class SeatReservDto {
  @ApiProperty({ description: 'uuid' })
  @IsNotEmpty()
  @IsString()
  readonly uuid: string;

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
