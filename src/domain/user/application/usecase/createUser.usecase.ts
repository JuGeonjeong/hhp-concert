import { Inject } from '@nestjs/common';
import { CreateUserDto } from '../../interface/dto/req/createUser.dto';
import { UserService } from '../service/user.service';

export class CreateUserUsecase {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async execute(createUserDto: CreateUserDto) {
    // const isEmailTaken = await this.userService.isEmailTaken(
    //   createUserDto.email,
    // );
    // if (isEmailTaken) {
    //   throw new Error('Email is already taken');
    // }

    // 유저 생성
    const user = await this.userService.createUser(createUserDto);
    return user;
  }
}
