import { Inject } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PointService } from '../../user/application/service/point.service';
import { QueueService } from '../../queue/application/queue.service';
import { UserService } from '../../user/application/service/user.service';
import { ConcertService } from 'src/domain/concert/application/service/concert.service';
import { QueueStatusEnum } from 'src/domain/queue/domain/queue.entity';

export class PaySeatUsecase {
  constructor(
    @Inject(PaymentService)
    private readonly paymentService: PaymentService,
    @Inject(UserService)
    private readonly userService: UserService,
    @Inject(PointService)
    private readonly pointService: PointService,
    @Inject(QueueService)
    private readonly queueService: QueueService,
    @Inject(ConcertService)
    private readonly concertService: ConcertService,
  ) {}

  async create(userId: number, seatId: number) {
    // 좌석유무 검색
    const seat = await this.concertService.findOne(seatId);
    // 유저 포인트 조회 가능여부
    // 유저 포인트 차감
    const user = await this.userService.findOne(userId);
    await this.pointService.isPoint(userId, seat.price);
    // 좌석 상태값 변경
    await this.concertService.updateStatus(seat);
    // 대기열 토큰만료
    const queue = await this.queueService.findOne(user.uuid);
    await this.queueService.update(queue, { status: QueueStatusEnum.OUT });
    // payment 생성
    return await this.paymentService.create(userId, seatId);
  }
}
