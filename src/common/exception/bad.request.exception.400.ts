import { HttpStatus } from '@nestjs/common';
import { ExceptionCodeType } from './exception.type';
import { BusinessException } from './exception';

export class BadRequestException400 extends BusinessException {
  constructor(message: string = '잘못된 요청입니다.') {
    super(ExceptionCodeType.BAD_REQUEST, message, HttpStatus.BAD_REQUEST);
  }
}
