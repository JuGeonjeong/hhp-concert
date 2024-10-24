import {
  Body,
  Controller,
  Get,
  HttpCode,
  ParseIntPipe,
  Post,
  Query,
  Version,
} from '@nestjs/common';
import { CreateUserUsecase } from '../../application/usecase/createUser.usecase';
import { ResponseSuccessDto } from 'src/common/dto/responseSuccess.dto';
import { PointChargeUsecase } from '../../application/usecase/pointCharge.usecase';
import { CreateUserDto } from '../dto/req/createUser.dto';
import { PointChargeDto } from '../dto/req/pointCharge.dto';
import { FindPointUsecase } from '../../application/usecase/findPoint.usecase';
import { ResPointDto } from '../dto/res/resPoint.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import User from '../../domain/entity/user.entity';
import { ApiDataResponse } from 'src/common/api/baseDataResponse';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly registerUserUseCase: CreateUserUsecase,
    private readonly pointChargeUsecase: PointChargeUsecase,
    private readonly findPointUsecase: FindPointUsecase,
  ) {}

  @Post('')
  @HttpCode(200)
  @Version('1')
  @ApiOperation({ summary: '유저 생성', description: '유저를 생성 합니다.' })
  @ApiDataResponse(User)
  async registerUserV1(@Body() createUserDto: CreateUserDto) {
    const data = await this.registerUserUseCase.execute(createUserDto);
    return new ResponseSuccessDto<any>({ data });
  }

  @Post('')
  @HttpCode(200)
  @Version('2')
  @ApiOperation({
    summary: 'v2유저 생성',
    description: 'v2유저를 생성 합니다.',
  })
  async registerUserV2(@Body() createUserDto: CreateUserDto) {
    const data = await this.registerUserUseCase.execute(createUserDto);
    return new ResponseSuccessDto<any>({ data });
  }

  @Post('charge')
  @HttpCode(200)
  @ApiOperation({ summary: '포인트 충전', description: '포인트 충전 합니다.' })
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
  @ApiOperation({ summary: '포인트 조회', description: '포인트 조회 합니다.' })
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
