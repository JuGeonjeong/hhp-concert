import { ExceptionCodeType } from './exception.type';
import { BusinessException } from './exception';
import { HttpStatus } from '@nestjs/common';

export class InternalException500 extends BusinessException {
  constructor(message: string = 'internal error.') {
    super(
      ExceptionCodeType.INTERNAL_SERVER_ERROR,
      message,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
