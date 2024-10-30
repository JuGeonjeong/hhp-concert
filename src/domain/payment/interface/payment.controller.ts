import { Controller, Get, HttpCode, ParseIntPipe, Query } from '@nestjs/common';
import { PaySeatUsecase } from '../application/usecase/paySeat.usecase';
import { ResponseSuccessDto } from 'src/common/dto/responseSuccess.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paySeatUsecase: PaySeatUsecase) {}

  @Get('')
  @HttpCode(200)
  @ApiOperation({ summary: '좌석 결제', description: '좌석 결제 합니다.' })
  async findPoints(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('seatId', ParseIntPipe) seatId: number,
  ): Promise<ResponseSuccessDto<any>> {
    const data = await this.paySeatUsecase.create(userId, seatId);
    console.log(data);
    return new ResponseSuccessDto<any>({ data });
  }
}
