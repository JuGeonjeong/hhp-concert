import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { BadRequestException400 } from '../exception/bad.request.exception.400';

export const ReqToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    let tokenInfo: any = null;

    if (request.headers.authorization) {
      console.log('authorization', request.headers.authorization);
      tokenInfo = jwt.verify(
        request.headers['authorization'].split(' ')[1],
        process.env.JWT_SECRET_KEY,
      );
    } else if (request.signedCookies.token) {
      console.log('cookie', request.signedCookies.token);
      tokenInfo = jwt.verify(
        request.signedCookies.token,
        process.env.JWT_SECRET_KEY,
      );
    } else {
      throw new BadRequestException400(`토큰이 없습니다.`);
    }
    console.log('tokenInfo', tokenInfo);
    return tokenInfo;
  },
);
