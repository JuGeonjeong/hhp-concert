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
    await this.userService.findOne(userId);
    return await this.pointService.findPoint(userId);
  }
}
