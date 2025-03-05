import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common';
import { ResponseSuccessDto } from 'src/common/dto/responseSuccess.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrderRequestDto } from '../dto/orderRequest.dto';
import { PaymentRequestDto } from '../dto/paymentRequest.dto';
import { PaymentFacade } from '../../application/payment.facade';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(
    @Inject(PaymentFacade)
    private readonly paymentFacade: PaymentFacade,
  ) {}

  @Post('')
  @HttpCode(200)
  @ApiOperation({
    summary: '좌석 주문',
    description: '좌석 주문을 생성합니다.',
  })
  async order(@Body() body: OrderRequestDto): Promise<ResponseSuccessDto<any>> {
    const data = await this.paymentFacade.create(body);
    return new ResponseSuccessDto<any>({ data });
  }

  @Post('pay')
  @HttpCode(200)
  @ApiOperation({ summary: '좌석 결제', description: '좌석 결제 합니다.' })
  async pay(@Body() body: PaymentRequestDto): Promise<ResponseSuccessDto<any>> {
    const data = await this.paymentFacade.paySeat(body);
    return new ResponseSuccessDto<any>({ data });
  }
}
