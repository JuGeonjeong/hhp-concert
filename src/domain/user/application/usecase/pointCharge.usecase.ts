import { Inject } from '@nestjs/common';
import { Mutex } from 'async-mutex';
import { PointService } from '../service/point.service';
import { UserService } from '../service/user.service';

export class PointChargeUsecase {
  constructor(
    @Inject(PointService)
    private readonly pointService: PointService,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async charge(userId: number, points: number) {
    const mutex = new Mutex();
    return mutex.runExclusive(async () => {
      const user = await this.userService.findOne(userId);
      const point = await this.pointService.charge(userId, points, user);
      return { user, point };
    });
  }
}
