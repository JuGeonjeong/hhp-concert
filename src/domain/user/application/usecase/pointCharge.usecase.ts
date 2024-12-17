import { Inject } from '@nestjs/common';

import { PointService } from '../service/point.service';
import { UserService } from '../service/user.service';

export class PointChargeUsecase {
  constructor(
    @Inject(PointService)
    private readonly pointService: PointService,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async charge({ userId, point }) {
    const exUser = await this.userService.findOne(userId);
    const exPoint = await this.pointService.charge({ userId, point });
    return { user: exUser, point: exPoint };
  }
}
