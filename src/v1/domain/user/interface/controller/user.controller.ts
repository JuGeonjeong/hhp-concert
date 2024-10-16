import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../dto/req/createUser.dto';
import { CreateUserUsecase } from '../../application/usecase/createUser.usecase';

@Controller('user')
export class UserController {
  constructor(private readonly registerUserUseCase: CreateUserUsecase) {}

  @Post('')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return await this.registerUserUseCase.execute(createUserDto);
  }
}
