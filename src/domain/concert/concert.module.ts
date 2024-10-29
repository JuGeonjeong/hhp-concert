import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Concert from './domain/entity/concert.entity';
import Schedule from './domain/entity/schedule.entity';
import Seat from './domain/entity/seat.entity';
import { ConcertController } from './interface/controller/concert.controller';
import { ConcertRepositoryImpl } from './infrastructure/concertRepository.impl';
import { ScheduleRepositoryImpl } from './infrastructure/scheduleRepository.impl';
import { SeatRepositoryImpl } from './infrastructure/seatRepository.impl';
import { ConcertService } from './domain/service/concert.service';
import { AvailableDatesUsecase } from './application/usecase/availableDates.usecase';
import { AvailableSeatsUsecase } from './application/usecase/availableSeats.usecase';
import { TakeSeatUsecase } from './application/usecase/takeSeat.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([Concert, Schedule, Seat])],
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
    AvailableDatesUsecase,
    AvailableSeatsUsecase,
    TakeSeatUsecase,
  ],
})
export class ConcertModule {}
