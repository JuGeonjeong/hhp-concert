import { IsInt, IsNotEmpty } from 'class-validator';

export class OrderRequestDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  seatId: number;

  @IsInt()
  @IsNotEmpty()
  amount: number;
}
