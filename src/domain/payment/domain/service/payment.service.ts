import { Inject, Injectable } from '@nestjs/common';
import { PaymentRepository } from '../repository/payment.repository';
import { Payment } from '../entity/payment';
import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { PaymentStatusEnum } from '../../infrastructure/entity/payment.entity';
import { Seat } from 'src/domain/concert/domain/entity/seat';
import { SeatStatusEnum } from 'src/domain/concert/infrastructure/entity/seat.entity';
import {
  PaymentEventPublisher,
  PaymentSuccessEvent,
} from '../../application/event/paymentEventPublisher';
import { PointService } from 'src/domain/user/domain/service/point.service';
import { UserService } from 'src/domain/user/domain/service/user.service';
import { ConcertService } from 'src/domain/concert/domain/service/concert.service';

@Injectable()
export class PaymentService {
  constructor(
    private dataSource: DataSource,
    @Inject('IPaymentRepository')
    private readonly paymentRepository: PaymentRepository,
    private readonly paymentEventPublisher: PaymentEventPublisher,
    @Inject(UserService)
    private readonly userService: UserService,
    @Inject(PointService)
    private readonly pointService: PointService,
    @Inject(ConcertService)
    private readonly concertService: ConcertService,
  ) {}

  async create(request) {
    const { userId, seatId, amount } = request;
    const seat = await this.concertService.findOne(seatId);
    Seat.availablePayment(seat);
    seat.expiredAt = Seat.add29ExpiredAt(seat.expiredAt);
    await this.concertService.update(seat);
    const payment = new Payment({
      userId,
      seatId: seat.id,
      orderKey: uuidv4,
      status: PaymentStatusEnum.WAIT,
      amount,
    });
    return await this.paymentRepository.create(payment);
  }

  async findOne(orderKey: string) {
    return await this.paymentRepository.findOne(orderKey);
  }

  async pay(request) {
    const { userId, seatId, amount } = request;
    await this.dataSource.transaction(async (transactionManager) => {
      // (1) 결제 요청 검증
      Payment.validate(request);
      // (2) 유저 포인트 차감
      await this.userService.findOne(userId);
      await this.pointService.useCheck(userId, amount);
      // (3)좌석 유무 검색
      const seat = await this.concertService.findOne(seatId);
      // (4)좌석 예약완료 변경
      await this.concertService.update({
        ...seat,
        status: SeatStatusEnum.RESERVED,
      });
      // (5) 결제 정보 저장
      const payment = await this.paymentRepository.save(
        transactionManager,
        request,
      );
      // 결제 성공 이벤트 발행
      this.paymentEventPublisher.success(
        new PaymentSuccessEvent(payment.orderKey),
      );
    });
  }
}
