import { Controller, Get, HttpCode, Post, Res } from '@nestjs/common';
import { CreateTokenUsecase } from '../../application/createToken.usecase';
import { Response } from 'express';
import { ReqToken } from '../decorator/token.decorator';
import { ResTokenDto } from '../dto/resToken.dto';
import { CheckTokenUsecase } from '../../application/checkToken.usecase';
import { CookieAdapter } from '../adapter/Cookie.adapter';
import { ResponseSuccessDto } from 'src/common/dto/responseSuccess.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Waiting-queue')
@ApiBearerAuth('JWT-auth')
@Controller('waiting-queue')
export class QueueController {
  constructor(
    private readonly createTokenUseCase: CreateTokenUsecase,
    private readonly checkTokenUseCase: CheckTokenUsecase,
    private readonly cookieAdapter: CookieAdapter,
  ) {}

  @Post('issue')
  @HttpCode(200)
  @ApiOperation({
    summary: '대기열 등록',
    description: '대기열 등록 합니다.',
  })
  async createToken(
    @Res({ passthrough: true }) response: Response,
  ): Promise<ResponseSuccessDto<any>> {
    const data = await this.createTokenUseCase.create();
    await this.cookieAdapter.setCookie(response, data.token, data.expiryDate);
    return new ResponseSuccessDto<any>({ data: new ResTokenDto(data.queue) });
  }

  @Get('check')
  @HttpCode(200)
  @ApiOperation({
    summary: '대기열 확인',
    description: '대기열 확인 합니다.',
  })
  async checkToken(
    // bearer token 유무 확인
    @ReqToken() token,
  ): Promise<ResponseSuccessDto<any>> {
    const data = await this.checkTokenUseCase.check(token);
    return new ResponseSuccessDto<any>({ data });
  }
}
