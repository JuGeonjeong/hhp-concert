import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class PointChargeDto {
  @ApiProperty({ description: '포인트', example: 1 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(50000)
  readonly point: number;
}
