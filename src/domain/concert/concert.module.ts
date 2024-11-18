import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConcertController } from './interface/api/concert.controller';
import { AvailableDatesUsecase } from './application/usecase/availableDates.usecase';
import { AvailableSeatsUsecase } from './application/usecase/availableSeats.usecase';
import { TakeSeatUsecase } from './application/usecase/takeSeat.usecase';
import { ConcertService } from './application/service/concert.service';
import ConcertEntity from './infrastructure/entity/concert.entity';
import SeatEntity from './infrastructure/entity/seat.entity';
import ScheduleEntity from './infrastructure/entity/schedule.entity';
import { ConcertRepositoryImpl } from './infrastructure/repository/concert.repository.impl';
import { ScheduleRepositoryImpl } from './infrastructure/repository/schedule.repository.impl';
import { SeatRepositoryImpl } from './infrastructure/repository/seat.repository.impl';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConcertEntity, ScheduleEntity, SeatEntity]),
  ],
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
