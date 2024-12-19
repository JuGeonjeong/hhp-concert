import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class PointChargeDto {
  @ApiProperty({ description: '유저 고유키', example: 1 })
  @IsNotEmpty()
  @IsInt()
  readonly userId: number;

  @ApiProperty({ description: '포인트', example: 1000 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(100000)
  readonly point: number;
}
