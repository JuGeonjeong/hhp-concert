import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ResponseSuccessDto } from 'src/common/dto/responseSuccess.dto';
import { AvailableDatesUsecase } from '../../application/usecase/availableDates.usecase';
import { AvailableSeatsUsecase } from '../../application/usecase/availableSeats.usecase';
import { ResDatesDto } from '../dto/res/resDates.dto';
import { TakeSeatUsecase } from '../../application/usecase/takeSeat.usecase';
import { SeatReservDto } from '../dto/req/seatReserv.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateOrderUsecase } from 'src/domain/payment/application/usecase/createOrder.usecase';
import { PaymentSeatDto } from '../dto/req/payment.seat.dto';

@ApiTags('Concert')
@Controller('concert')
export class ConcertController {
  constructor(
    private readonly availableDatesUsecase: AvailableDatesUsecase,
    private readonly availableSeatsUsecase: AvailableSeatsUsecase,
    private readonly takeSeatUsecase: TakeSeatUsecase,
    private readonly createOrderUsecase: CreateOrderUsecase,
    @Inject('KAFKA_CLIENT')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit(): Promise<void> {
    this.kafkaClient.subscribeToResponseOf('reservation');
    this.kafkaClient.subscribeToResponseOf('payment');

    await this.kafkaClient.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.kafkaClient.close();
  }

  // GET /concert/available-dates
  @Get('available-dates')
  @HttpCode(200)
  @ApiOperation({
    summary: '예약가능 날짜 조회',
    description: '예약가능 날짜를 조회 합니다.',
  })
  async findDates(
    @Query('concertId', ParseIntPipe) concertId: number,
  ): Promise<ResponseSuccessDto<any>> {
    const data = await this.availableDatesUsecase.findDates(concertId);
    return new ResponseSuccessDto<any>({
      data: data.map((schedule) => new ResDatesDto(schedule)),
    });
  }

  // GET /concert/available-seats
  @Get('available-seats')
  @HttpCode(200)
  @ApiOperation({
    summary: '예약가능 좌석 조회',
    description: '예약가능 좌석을 조회 합니다.',
  })
  async findSeats(
    @Query('scheduleId', ParseIntPipe) scheduleId: number,
  ): Promise<ResponseSuccessDto<any>> {
    const data = await this.availableSeatsUsecase.findSeats(scheduleId);
    return new ResponseSuccessDto<any>({ data });
  }

  // POST /concert/resevation 좌석 5분 임시예약
  @Post('reservation')
  @HttpCode(200)
  @ApiOperation({
    summary: '좌석 임시예약',
    description: '좌석 5분 임시예약 합니다.',
  })
  async createReserv(
    @Body() body: SeatReservDto,
  ): Promise<ResponseSuccessDto<any>> {
    const data = await this.takeSeatUsecase.reserv(body);
    return new ResponseSuccessDto<any>({ data });
  }

  @MessagePattern('payment')
  async handleReservationSeat(
    @Payload() message: PaymentSeatDto,
    // @Ctx() context: KafkaContext,
  ) {
    const { userId, seatId, createdAt, seatNumber } = message;

    return await this.createOrderUsecase.create({
      userId,
      seatId,
      createdAt,
      seatNumber,
    });
  }
}
