import { Inject } from '@nestjs/common';
import { PointService } from '../../domain/service/point.service';
import { UserService } from '../../domain/service/user.service';

export class FindPointUsecase {
  constructor(
    @Inject(PointService)
    private readonly pointService: PointService,
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async findOne(userId: number) {
    const user = await this.userService.findOne(userId);
    const point = await this.pointService.findPoint(userId);
    return { user, point };
  }
}
