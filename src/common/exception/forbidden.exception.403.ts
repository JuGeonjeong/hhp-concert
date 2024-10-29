import { HttpStatus } from '@nestjs/common';
import { ExceptionCodeType } from './exception.type';
import { BusinessException } from './exception';

export class ForbiddenException extends BusinessException {
  constructor(message: string = '권한이 없습니다.') {
    super(ExceptionCodeType.FORBIDDEN, message, HttpStatus.FORBIDDEN);
  }
}
