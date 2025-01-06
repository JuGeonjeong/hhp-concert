import { Inject } from '@nestjs/common';
import { PointService } from '../../domain/service/point.service';
import { UserService } from '../../domain/service/user.service';

export class PointChargeUsecase {
  constructor(
    @Inject(PointService)
    private readonly pointService: PointService,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async charge(body: any) {
    const exUser = await this.userService.findOne(body.userId);
    const exPoint = await this.pointService.charge(body);
    return { userId: exUser.getId(), amount: exPoint.amount };
  }
}
