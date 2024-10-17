import {
  Body,
  Controller,
  Get,
  HttpCode,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ResponseSuccessDto } from 'src/v1/common/dto/responseSuccess.dto';
import { AvailableDates } from '../../application/usecase/availableDates.usecase';
import { AvailableSeats } from '../../application/usecase/availableSeats.usecase';
import { ResDatesDto } from '../dto/res/resDates.dto';
import { TakeSeat } from '../../application/usecase/takeSeat.usecase';
import { SeatReservDto } from '../dto/req/seatReserv.dto';

@Controller('concert')
export class ConcertController {
  constructor(
    private readonly availableDates: AvailableDates,
    private readonly availableSeats: AvailableSeats,
    private readonly takeSeat: TakeSeat,
  ) {}

  // GET /concert/available-dates
  @Get('available-dates')
  @HttpCode(200)
  async findDates(
    @Query('concertId', ParseIntPipe) concertId: number,
  ): Promise<ResponseSuccessDto<any>> {
    const data = await this.availableDates.findDates(concertId);
    return new ResponseSuccessDto<any>({
      data: data.map((schedule) => new ResDatesDto(schedule)),
    });
  }

  // GET /concert/available-seats
  @Get('available-seats')
  @HttpCode(200)
  async findSeats(
    @Query('scheduleId', ParseIntPipe) scheduleId: number,
  ): Promise<ResponseSuccessDto<any>> {
    const data = await this.availableSeats.findSeats(scheduleId);
    return new ResponseSuccessDto<any>({ data });
  }

  // 좌석 5분 임시예약
  @Post('reservation')
  @HttpCode(200)
  async createReserv(
    @Body() body: SeatReservDto,
  ): Promise<ResponseSuccessDto<any>> {
    const data = await this.takeSeat.reserv(body);
    return new ResponseSuccessDto<any>({ data });
  }
}
