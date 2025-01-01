import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { PointChargeDto } from '../dto/req/pointCharge.dto';
import { ResPointDto } from '../dto/res/resPoint.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiDataResponse } from 'src/common/api/baseDataResponse';
import { User } from '../../domain/entity/user';
import { CreateUserDto } from '../dto/req/createUser.dto';
import { UserFacade } from '../../application/user.facade';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    @Inject(UserFacade)
    private readonly userFacade: UserFacade,
  ) {}

  @ApiOperation({ summary: '유저 생성', description: '유저를 생성 합니다.' })
  @ApiDataResponse(User)
  @HttpCode(200)
  @Post('')
  async register(@Body() createUserDto: CreateUserDto): Promise<any> {
    return await this.userFacade.createUser(createUserDto);
  }

  @ApiOperation({ summary: '포인트 충전', description: '포인트 충전 합니다.' })
  @ApiDataResponse(ResPointDto)
  @HttpCode(200)
  @Post('charge')
  async charge(@Body() body: PointChargeDto): Promise<any> {
    const data = await this.userFacade.charge(body);
    return new ResPointDto(data);
  }

  @ApiOperation({ summary: '포인트 조회', description: '포인트 조회 합니다.' })
  @ApiDataResponse(User)
  @HttpCode(200)
  @Get('point')
  async findPoints(
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<ResPointDto> {
    const data = await this.userFacade.findOne(userId);
    return new ResPointDto(data);
  }
}
