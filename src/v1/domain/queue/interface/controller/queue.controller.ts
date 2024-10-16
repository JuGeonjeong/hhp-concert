import { Controller, Get, HttpCode, Post, Res } from '@nestjs/common';
import { CreateTokenUsecase } from '../../application/createToken.usecase';
import { Response } from 'express';
import { ReqToken } from '../decorator/token.decorator';
import { ResTokenDto } from '../dto/resToken.dto';
import { CheckTokenUsecase } from '../../application/checkToken.usecase';
import { CookieAdapter } from '../adapter/Cookie.adapter';
import { ResponseSuccessDto } from 'src/v1/common/dto/responseSuccess.dto';

@Controller('waiting-queue')
export class QueueController {
  constructor(
    private readonly createTokenUseCase: CreateTokenUsecase,
    private readonly checkTokenUseCase: CheckTokenUsecase,
    private readonly cookieAdapter: CookieAdapter,
  ) {}

  @Post('issue')
  @HttpCode(201)
  async createToken(
    @Res({ passthrough: true }) response: Response,
  ): Promise<ResponseSuccessDto<any>> {
    const data = await this.createTokenUseCase.create();
    this.cookieAdapter.setCookie(response, data.token, data.expiryDate);
    return new ResponseSuccessDto<any>({ data: new ResTokenDto(data.queue) });
  }

  @Get('check')
  @HttpCode(201)
  async checkToken(
    // bearer token 유무 확인
    @ReqToken() token,
  ): Promise<ResponseSuccessDto<any>> {
    const data = await this.checkTokenUseCase.check(token);
    return new ResponseSuccessDto<any>({ data });
  }
}
