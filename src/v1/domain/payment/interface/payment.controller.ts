import { Controller, Get, HttpCode, ParseIntPipe, Query } from '@nestjs/common';
import { PaySeatUsecase } from '../application/paySeat.usecase';
import { ResponseSuccessDto } from 'src/v1/common/dto/responseSuccess.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paySeatUsecase: PaySeatUsecase) {}

  @Get('')
  @HttpCode(200)
  async findPoints(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('seatId', ParseIntPipe) seatId: number,
  ): Promise<ResponseSuccessDto<any>> {
    const data = await this.paySeatUsecase.create(userId, seatId);
    console.log(data);
    return new ResponseSuccessDto<any>({ data });
  }
}
