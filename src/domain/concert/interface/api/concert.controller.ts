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
    return data.map((schedule: any) => new ResDatesDto(schedule));
  }

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

  @MessagePattern('seat-reservation')
  async handleReservation(@Payload() message: any) {
    const { userId, seatId } = message;

    // const redis = this.redisService.getClient();
    const lockKey = `lock:seat:${seatId}`;

    // const lock = await redis.set(lockKey, userId, 'NX', 'EX', 60);
    // if (!lock) {
    // console.log(`❌ 좌석 ${seatId} 이미 예약됨`);
    // return;
    // }

    console.log(`✅ 좌석 예약 성공: 좌석 ${seatId}, 사용자 ${userId}`);

    // await redis.hSet(`reservation:${seatId}`, 'userId', userId);
    // await redis.hSet(`reservation:${seatId}`, 'status', 'reserved');

    // 결과 전송
    const resultMessage = { seatId, status: 'reserved', userId };
    // this.redisService.getClient().publish('reservation-result', JSON.stringify(resultMessage));
  }
}
