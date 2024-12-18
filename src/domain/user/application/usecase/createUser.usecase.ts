import { Inject } from '@nestjs/common';
import { UserService } from '../service/user.service';

export class CreateUserUsecase {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async execute(createUserDto) {
    const user = await this.userService.createUser(createUserDto);
    return user;
  }
}
