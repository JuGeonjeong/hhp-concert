import { Inject } from '@nestjs/common';
import { UserService } from '../../domain/service/user.service';

export class CreateUserUsecase {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async createUser(createUserDto: any) {
    return await this.userService.createUser(createUserDto);
  }
}
