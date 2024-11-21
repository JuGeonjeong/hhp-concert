import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ResponseSuccessDto } from 'src/common/dto/responseSuccess.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateOrderUsecase } from '../../application/usecase/createOrder.usecase';
import { PaySeatUsecase } from '../../application/usecase/paySeat.usecase';
import { OrderRequestDto } from '../dto/orderRequest.dto';
import { PaymentRequestDto } from '../dto/paymentRequest.dto';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paySeatUsecase: PaySeatUsecase,
    private readonly createOrderUsecase: CreateOrderUsecase,
  ) {}

  @Post('')
  @HttpCode(200)
  @ApiOperation({
    summary: '좌석 주문',
    description: '좌석 주문을 생성합니다.',
  })
  async order(@Body() body: OrderRequestDto): Promise<ResponseSuccessDto<any>> {
    const data = await this.createOrderUsecase.create(body);
    return new ResponseSuccessDto<any>({ data });
  }

  @Post('pay')
  @HttpCode(200)
  @ApiOperation({ summary: '좌석 결제', description: '좌석 결제 합니다.' })
  async pay(@Body() body: PaymentRequestDto): Promise<ResponseSuccessDto<any>> {
    const data = await this.paySeatUsecase.pay(body);
    return new ResponseSuccessDto<any>({ data });
  }
}
