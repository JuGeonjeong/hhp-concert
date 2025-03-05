import { BadRequestException400 } from 'src/common/exception/bad.request.exception.400';

export class Point {
  private static readonly MAX_POINTS = 100000;
  userId: number;
  point: number;

  constructor(args: { userId: number; point: number }) {
    this.userId = args.userId;
    this.point = args.point;
  }

  check(amount: number): void {
    if (this.point + amount > Point.MAX_POINTS) {
      throw new BadRequestException400(
        `최대 충전 가능한 포인트는 ${Point.MAX_POINTS}입니다. 다시 시도해주세요.`,
      );
    }
  }

  charge(amount: number): void {
    this.point += amount;
  }
}
