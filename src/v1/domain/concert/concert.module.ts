import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Concert from './domain/entity/concert.entity';
import Reservation from './domain/entity/reservation.entity';
import Schedule from './domain/entity/schedule.entity';
import Seat from './domain/entity/seat.entity';
import { ConcertController } from './interface/controller/concert.controller';
import { ConcertService } from './application/service/concert.service';
import { AvailableDates } from './application/usecase/availableDates.usecase';
import { AvailableSeats } from './application/usecase/availableSeats.usecase';
import { ConcertRepositoryImpl } from './infrastructure/concertRepository.impl';
import { ScheduleRepositoryImpl } from './infrastructure/scheduleRepository.impl';
import { ScheduleService } from './application/service/schedule.service';
import { SeatRepositoryImpl } from './infrastructure/seatRepository.impl';
import { SeatService } from './application/service/seat.service';
import { TakeSeat } from './application/usecase/takeSeat.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([Concert, Reservation, Schedule, Seat])],
  controllers: [ConcertController],
  providers: [
    {
      provide: 'IConcertRepository',
      useClass: ConcertRepositoryImpl,
    },
    {
      provide: 'IScheduleRepository',
      useClass: ScheduleRepositoryImpl,
    },

    {
      provide: 'ISeatRepository',
      useClass: SeatRepositoryImpl,
    },
    ConcertService,
    ScheduleService,
    SeatService,
    AvailableDates,
    AvailableSeats,
    TakeSeat,
  ],
})
export class ConcertModule {}
