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
import { ResDatesDto } from '../dto/res/resDates.dto';
import { SeatReservDto } from '../dto/req/seatReserv.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateOrderUsecase } from 'src/domain/payment/application/usecase/createOrder.usecase';
import { PaymentSeatDto } from '../dto/req/payment.seat.dto';
import { ConcertFacade } from '../../application/concert.facade';

@ApiTags('Concert')
@Controller('concert')
export class ConcertController {
  constructor(
    @Inject(ConcertFacade)
    private readonly concertFacade: ConcertFacade,
    private readonly createOrderUsecase: CreateOrderUsecase,
    // @Inject('KAFKA_CLIENT')
    // private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit(): Promise<void> {
    // this.kafkaClient.subscribeToResponseOf('reservation');
    // this.kafkaClient.subscribeToResponseOf('payment');
    // await this.kafkaClient.connect();
  }

  // async onModuleDestroy(): Promise<void> {
  // await this.kafkaClient.close();
  // }

  // GET /concert/available-dates
  @ApiOperation({
    summary: '예약가능 날짜 조회',
    description: '예약가능 날짜를 조회 합니다.',
  })
  @HttpCode(200)
  @Get('available-dates')
  async findDates(
    @Query('concertId', ParseIntPipe) concertId: number,
  ): Promise<any> {
    const data = await this.concertFacade.findDates(concertId);
    return data.map((schedule) => new ResDatesDto(schedule));
  }

  // GET /concert/available-seats
  @ApiOperation({
    summary: '예약가능 좌석 조회',
    description: '예약가능 좌석을 조회 합니다.',
  })
  @HttpCode(200)
  @Get('available-seats')
  async findSeats(
    @Query('scheduleId', ParseIntPipe) scheduleId: number,
  ): Promise<any> {
    return await this.concertFacade.findSeats(scheduleId);
  }

  // POST /concert/resevation 좌석 5분 임시예약
  @ApiOperation({
    summary: '좌석 임시예약',
    description: '좌석 5분 임시예약 합니다.',
  })
  @HttpCode(200)
  @Post('reservation')
  async createReserv(@Body() body: SeatReservDto): Promise<any> {
    return await this.concertFacade.reservationSeat(body);
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
