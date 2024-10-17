import {
  Body,
  Controller,
  Get,
  HttpCode,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserUsecase } from '../../application/usecase/createUser.usecase';
import { ResponseSuccessDto } from 'src/v1/common/dto/responseSuccess.dto';
import { PointChargeUsecase } from '../../application/usecase/pointCharge.usecase';
import { CreateUserDto } from '../dto/req/createUser.dto';
import { PointChargeDto } from '../dto/req/pointCharge.dto';
import { FindPointUsecase } from '../../application/usecase/findPoint.usecase';
import { ResPointDto } from '../dto/res/resPoint.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly registerUserUseCase: CreateUserUsecase,
    private readonly pointChargeUsecase: PointChargeUsecase,
    private readonly findPointUsecase: FindPointUsecase,
  ) {}

  @Post('')
  @HttpCode(200)
  async registerUser(@Body() createUserDto: CreateUserDto) {
    const data = await this.registerUserUseCase.execute(createUserDto);
    return new ResponseSuccessDto<any>({ data });
  }

  @Post('charge')
  @HttpCode(200)
  async charge(
    @Query('userId', ParseIntPipe) userId: number,
    @Body() body: PointChargeDto,
  ): Promise<ResponseSuccessDto<any>> {
    const data = await this.pointChargeUsecase.charge(userId, body.point);
    return new ResponseSuccessDto<any>({
      data: new ResPointDto(data.user, data.point),
    });
  }

  @Get('point')
  @HttpCode(200)
  async findPoints(
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<ResponseSuccessDto<any>> {
    const data = await this.findPointUsecase.findOne(userId);
    console.log(data);
    return new ResponseSuccessDto<any>({
      data: new ResPointDto(data.user, data.point),
    });
  }
}
