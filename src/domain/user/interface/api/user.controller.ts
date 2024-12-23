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
import { PointChargeUsecase } from '../../application/usecase/pointCharge.usecase';
import { PointChargeDto } from '../dto/req/pointCharge.dto';
import { FindPointUsecase } from '../../application/usecase/findPoint.usecase';
import { ResPointDto } from '../dto/res/resPoint.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiDataResponse } from 'src/common/api/baseDataResponse';
import { User } from '../../domain/entity/user';
import { CreateUserDto } from '../dto/req/createUser.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly registerUserUseCase: CreateUserUsecase,
    private readonly pointChargeUsecase: PointChargeUsecase,
    private readonly findPointUsecase: FindPointUsecase,
  ) {}

  @ApiOperation({ summary: '유저 생성', description: '유저를 생성 합니다.' })
  @ApiDataResponse(User)
  @HttpCode(200)
  @Post('')
  async register(@Body() createUserDto: CreateUserDto): Promise<any> {
    return await this.registerUserUseCase.execute(createUserDto);
  }

  @ApiOperation({ summary: '포인트 충전', description: '포인트 충전 합니다.' })
  @ApiDataResponse(ResPointDto)
  @HttpCode(200)
  @Post('charge')
  async charge(@Body() body: PointChargeDto): Promise<any> {
    const data = await this.pointChargeUsecase.charge(body);
    return new ResPointDto(data);
  }

  @ApiOperation({ summary: '포인트 조회', description: '포인트 조회 합니다.' })
  @ApiDataResponse(User)
  @HttpCode(200)
  @Get('point')
  async findPoints(
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<ResPointDto> {
    const data = await this.findPointUsecase.findOne(userId);
    return new ResPointDto(data);
  }
}
