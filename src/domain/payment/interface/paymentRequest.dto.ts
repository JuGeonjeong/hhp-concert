import { IsOptional, IsString } from 'class-validator';

export class PaymentRequestDto {
  @IsString()
  @IsOptional()
  orderKey?: string;
}
