import {
  Controller,
  Get,
  HttpCode,
  Inject,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ReqToken } from '../../../../common/decorator/token.decorator';
import { ResTokenDto } from '../dto/resToken.dto';
import { CookieAdapter } from '../adapter/Cookie.adapter';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiDataResponse } from 'src/common/api/baseDataResponse';
import { TokenInfo } from '../dto/tokenInfo.dto';
import { QueueFacade } from '../../application/queue.facade';

@ApiTags('Waiting-queue')
@ApiBearerAuth('JWT-auth')
@Controller('waiting-queue')
export class QueueController {
  constructor(
    @Inject(QueueFacade)
    private readonly queueFacade: QueueFacade,
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
    const data = await this.queueFacade.createToken();
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
    return await this.queueFacade.checkToken(token);
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
    const data = await this.queueFacade.outToken(token);
    this.cookieAdapter.clearCookie(response);
    return new ResTokenDto(data);
  }
}
