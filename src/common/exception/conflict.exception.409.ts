import { HttpStatus } from '@nestjs/common';
import { ExceptionCodeType } from './exception.type';
import { BusinessException } from './exception';

export class ConflictException extends BusinessException {
  constructor(message: string = '인증이 필요합니다.') {
    super(ExceptionCodeType.CONFLICT, message, HttpStatus.CONFLICT);
  }
}
