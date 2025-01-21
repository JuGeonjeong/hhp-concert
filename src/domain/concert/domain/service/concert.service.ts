import { Inject, Injectable } from '@nestjs/common';
import { ConcertRepository } from '../../domain/repository/concertRepository';
import { ScheduleRepository } from '../../domain/repository/scheduleRepository';
import { SeatRepository } from '../../domain/repository/seatRepository';
import { Seat } from '../../domain/entity/seat';
import { Cron } from '@nestjs/schedule';
import { NotFoundException404 } from 'src/common/exception/not.found.exception.404';
import { BadRequestException400 } from 'src/common/exception/bad.request.exception.400';
import { SeatReservDto } from '../../interface/dto/req/seatReserv.dto';
import { UserRepository } from 'src/domain/user/domain/repository/userRepository';

@Injectable()
export class ConcertService {
  constructor(
    @Inject('IConcertRepository')
    private readonly concertRepository: ConcertRepository,
    @Inject('IScheduleRepository')
    private readonly scheduleRepository: ScheduleRepository,
    @Inject('ISeatRepository')
    private readonly seatsRepository: SeatRepository,
    @Inject('IUserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  /**
   * 콘서트 조회 합니다.
   */
  async findConcert(id: number): Promise<any> {
    const concert = await this.concertRepository.findOne(id);
    if (concert) {
      return concert;
    } else {
      throw new NotFoundException404(`없는 콘서트 입니다. id: ${id}`);
    }
  }

  /**
   * 콘서트의 날짜를 조회 합니다.
   */
  async findSchedules(concertId: number): Promise<any> {
    const schedules = await this.scheduleRepository.findSchedules(concertId);
    if (schedules) {
      return schedules;
    } else {
      throw new BadRequestException400(`콘서트 일정이 없습니다.`);
    }
  }

  /**
   * 콘서트 스케줄을 조회합니다.
   */
  async findSchedule(id: number): Promise<any> {
    const schedule = await this.scheduleRepository.findOne(id);
    if (!schedule) {
      throw new NotFoundException404(`없는 스케줄 입니다. id: ${id}`);
    }
    return schedule;
  }

  /**
   * 새로운 좌석을 생성합니다.
   */
  async create(body: SeatReservDto): Promise<any> {
    let user: any;
    const name = this.generateRandomName();
    const email = this.generateRandomEmail();
    const exUser = await this.userRepository.findByUuid(body.uuid);
    if (exUser) {
      user = exUser;
    } else {
      user = await this.userRepository.create({
        uuid: body.uuid,
        name,
        email,
      });
    }
    return await this.seatsRepository.create({
      userId: user.getId(),
      scheduleId: body.scheduleId,
      seatNumber: body.seatNumber,
    });
  }

  /**
   * 좌석의 정보를 조회합니다.
   */
  async findOne(id: number): Promise<any> {
    const data = await this.seatsRepository.findOne(id);
    if (!data) {
      throw new NotFoundException404(`없는 좌석 입니다. id: ${id}`);
    }
    return data;
  }

  async findSeats(id: number): Promise<any> {
    const seats = await this.seatsRepository.findSeats(id);
    if (!seats) {
      throw new NotFoundException404(`없는 스케줄 입니다. id: ${id}`);
    }
    const haveSeats = seats?.map((v: any) => v.seatNumber);
    const emptySeats = await this.getAvailableSeats(haveSeats);
    return emptySeats;
  }

  async getAvailableSeats(data: number[]): Promise<number[]> {
    const totalSeats = Array.from({ length: 50 }, (_, i) => i + 1);
    const availableSeats = totalSeats.filter((seat) => !data.includes(seat));
    return availableSeats;
  }

  async update(seat: Seat): Promise<any> {
    return await this.seatsRepository.update(seat);
  }

  // 매 1분마다 만료된 예약을 처리
  @Cron('*/1 * * * *')
  async handleReservationExpiry(): Promise<void> {
    // await this.seatsRepository.expireReservations();
  }

  generateRandomName(): string {
    const firstNames = [
      'John',
      'Jane',
      'Alex',
      'Chris',
      'Taylor',
      'Jordan',
      'Pat',
      'Sam',
      'Casey',
      'Jamie',
    ];
    const lastNames = [
      'Smith',
      'Doe',
      'Johnson',
      'Brown',
      'Davis',
      'Garcia',
      'Lee',
      'Martinez',
      'Clark',
      'Lopez',
    ];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    return `${firstName} ${lastName}`;
  }

  generateRandomEmail(): string {
    const domains = [
      'example.com',
      'test.com',
      'demo.com',
      'mail.com',
      'sample.org',
    ];
    const randomUser = Math.random().toString(36).substring(2, 10); // 랜덤 문자열
    const domain = domains[Math.floor(Math.random() * domains.length)];

    return `${randomUser}@${domain}`;
  }
}
