import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Concert } from './domain/entity/concert.entity';
import { Reservation } from './domain/entity/reservation.entity';
import { Schedule } from './domain/entity/schedule.entity';
import { Seat } from './domain/entity/seat.entity';
import { ConcertController } from './interface/controller/concert.controller';
import { ConcertService } from './application/service/concert.service';

@Module({
  imports: [TypeOrmModule.forFeature([Concert, Reservation, Schedule, Seat])],
  controllers: [ConcertController],
  providers: [ConcertService],
})
export class ConcertModule {}
