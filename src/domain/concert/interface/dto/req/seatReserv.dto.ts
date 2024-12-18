import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class SeatReservDto {
  @ApiProperty({ description: '예약자', example: '주건정' })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({ description: '예약자 이메일', example: 'wnrjswjd@gmail.com' })
  @IsNotEmpty()
  @IsString()
  readonly email: string;

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
