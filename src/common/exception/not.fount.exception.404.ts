import { ExceptionCodeType } from './exception.type';
import { BusinessException } from './exception';
import { HttpStatus } from '@nestjs/common';

export class NotFoundException404 extends BusinessException {
  constructor(message: string = '권한이 없습니다.') {
    super(ExceptionCodeType.NOT_FOUND, message, HttpStatus.NOT_FOUND);
  }
}
