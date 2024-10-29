import { HttpStatus } from '@nestjs/common';
import { ExceptionCodeType } from '../exception/exception.type';

export const HttpStatusMap: Record<ExceptionCodeType, HttpStatus> = {
  [ExceptionCodeType.BAD_REQUEST]: HttpStatus.BAD_REQUEST,
  [ExceptionCodeType.FORBIDDEN]: HttpStatus.FORBIDDEN,
  [ExceptionCodeType.UNAUTHORIZED]: HttpStatus.UNAUTHORIZED,
  [ExceptionCodeType.NOT_FOUND]: HttpStatus.NOT_FOUND,
  [ExceptionCodeType.CONFLICT]: HttpStatus.CONFLICT,
  [ExceptionCodeType.INTERNAL_SERVER_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
};
