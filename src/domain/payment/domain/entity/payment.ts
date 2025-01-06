// import { NotFoundException404 } from '../../../../../src/common/exception/not.found.exception.404';
import { NotFoundException404 } from 'src/common/exception/not.found.exception.404';
import { PaymentStatusEnum } from '../../infrastructure/entity/payment.entity';

export class Payment {
  id: number;
  orderKey: string;
  seatId: number;
  userId: number;
  amount: number;
  status: PaymentStatusEnum;

  constructor(args: {
    id?: number;
    orderKey: string;
    seatId: number;
    userId: number;
    amount: number;
    status: PaymentStatusEnum;
  }) {
    this.id = args.id;
    this.orderKey = args.orderKey;
    this.seatId = args.seatId;
    this.userId = args.userId;
    this.amount = args.amount;
    this.status = args.status;
  }

  static validate(request): void {
    // (1) 필수 필드 검증
    if (
      !request.userId ||
      !request.orderKey ||
      !request.amount ||
      !request.currency
    ) {
      throw new NotFoundException404('필수 필드가 누락되었습니다.');
    }

    // (2) 금액이 양수인지 검증
    if (request.amount <= 0) {
      throw new NotFoundException404('결제 금액은 양수여야 합니다.');
    }

    // (4) 추가 검증 예시: 사용자 ID, 주문 키 형식 확인 등
    if (
      typeof request.userId !== 'number' ||
      typeof request.orderKey !== 'string'
    ) {
      throw new NotFoundException404(
        '유효하지 않은 사용자 ID 또는 주문 키 형식입니다.',
      );
    }

    console.log('결제 요청 검증이 완료되었습니다.');
  }
}
