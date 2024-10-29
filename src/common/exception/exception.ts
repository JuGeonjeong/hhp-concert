import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionCodeType } from './exception.type';

export class BusinessException extends HttpException {
  constructor(
    public readonly code: ExceptionCodeType,
    public readonly message: string,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super({ code, message }, status);
  }
}
