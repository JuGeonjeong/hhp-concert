import { Inject } from '@nestjs/common';
import { UserService } from '../service/user.service';

export class CreateUserUsecase {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async execute(createUserDto) {
    return await this.userService.createUser(createUserDto);
  }
}
