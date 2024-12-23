import { Controller, Get, HttpCode, Post, Put, Res } from '@nestjs/common';
import { CreateTokenUsecase } from '../../application/usecase/createToken.usecase';
import { Response } from 'express';
import { ReqToken } from '../../../../common/decorator/token.decorator';
import { ResTokenDto } from '../dto/resToken.dto';
import { CheckTokenUsecase } from '../../application/usecase/checkToken.usecase';
import { CookieAdapter } from '../adapter/Cookie.adapter';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OutTokenUsecase } from '../../application/usecase/outToken.usecase';
import { ApiDataResponse } from 'src/common/api/baseDataResponse';
import { TokenInfo } from '../dto/tokenInfo.dto';

@ApiTags('Waiting-queue')
@ApiBearerAuth('JWT-auth')
@Controller('waiting-queue')
export class QueueController {
  constructor(
    private readonly createTokenUseCase: CreateTokenUsecase,
    private readonly checkTokenUseCase: CheckTokenUsecase,
    private readonly outTokenUseCase: OutTokenUsecase,
    private readonly cookieAdapter: CookieAdapter,
  ) {}

  @ApiOperation({
    summary: '대기열 등록',
    description: '대기열 등록 합니다.',
  })
  @HttpCode(200)
  @ApiDataResponse(ResTokenDto)
  @Post('issue')
  async createToken(
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    const data = await this.createTokenUseCase.create();
    this.cookieAdapter.setCookie(response, data.token, data.expiryDate);
    return new ResTokenDto(data.queue);
  }

  @ApiOperation({
    summary: '대기열 확인',
    description: '대기열 확인 합니다.',
  })
  @HttpCode(200)
  @ApiDataResponse(TokenInfo)
  @Get('check')
  async checkToken(@ReqToken() token): Promise<any> {
    return await this.checkTokenUseCase.check(token);
  }

  @ApiOperation({
    summary: '대기열 나가기',
    description: '대기열 상태를 나가기로 변경 합니다.',
  })
  @ApiDataResponse(ResTokenDto)
  @Put('out')
  async update(
    @Res({ passthrough: true }) response: Response,
    @ReqToken() token,
  ): Promise<any> {
    const data = await this.outTokenUseCase.update(token);
    this.cookieAdapter.clearCookie(response);
    return new ResTokenDto(data);
  }
}
