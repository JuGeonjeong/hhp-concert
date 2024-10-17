import { Inject } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { SeatService } from '../../concert/application/service/seat.service';
import { PointService } from '../../user/application/service/point.service';
import { QueueService } from '../../queue/application/queue.service';
import { UserService } from '../../user/application/service/user.service';

export class PaySeatUsecase {
  constructor(
    @Inject(PaymentService)
    private readonly paymentService: PaymentService,
    @Inject(UserService)
    private readonly userService: UserService,
    @Inject(SeatService)
    private readonly seatService: SeatService,
    @Inject(PointService)
    private readonly pointService: PointService,
    @Inject(QueueService)
    private readonly queueService: QueueService,
  ) {}

  async create(userId: number, seatId: number) {
    // 좌석유무 검색
    const seat = await this.seatService.findOne(seatId);
    // 유저 포인트 조회 가능여부
    // 유저 포인트 차감
    const user = await this.userService.findOne(userId);
    await this.pointService.isPoint(userId, seat.price);
    // 좌석 상태값 변경
    await this.seatService.updateStatus(seat);
    // 대기열 토큰만료
    await this.queueService.findAndUpdate(user.uuid);
    // payment 생성
    return await this.paymentService.create(userId, seatId);
  }
}
