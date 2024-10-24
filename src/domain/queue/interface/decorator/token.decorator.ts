import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const ReqToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    let tokenInfo = null;
    const bearerToken = request.headers['bearer']; // `bearer` 헤더에서 토큰 추출
    console.log(bearerToken);
    if (bearerToken) {
      try {
        tokenInfo = jwt.verify(bearerToken, process.env.JWT_SECRET_KEY); // JWT 검증
        return tokenInfo; // 토큰 정보 반환
      } catch {
        throw new BadRequestException(`존재하지 않는 토큰입니다.`);
      }
    } else {
      throw new BadRequestException(`토큰이 없습니다.`);
    }

    console.log('tokenInfo', tokenInfo);
    return tokenInfo; // 토큰 정보 반환
  },
);
