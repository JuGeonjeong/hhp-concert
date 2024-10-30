import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Schedule from './infrastructure/entity/schedule.typeorm.entity';
import Seat from './infrastructure/entity/seat.typeorm.entity';
import { ConcertController } from './interface/controller/concert.controller';
import { ConcertRepositoryImpl } from './infrastructure/repository/concert.repository.impl';
import { ScheduleRepositoryImpl } from './infrastructure/repository/schedule.repository.impl';
import { SeatRepositoryImpl } from './infrastructure/repository/seatRepository.impl';
import { ConcertService } from './domain/service/concert.service';
import { AvailableDatesUsecase } from './application/usecase/availableDates.usecase';
import { AvailableSeatsUsecase } from './application/usecase/availableSeats.usecase';
import { TakeSeatUsecase } from './application/usecase/takeSeat.usecase';
import Concert from './infrastructure/entity/concert.typeorm.entity';

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
