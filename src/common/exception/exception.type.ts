export enum ExceptionCodeType {
  // UnauthorizedException (401): 인증이 필요하지만, 클라이언트가 인증되지 않았을 때 발생.
  UNAUTHORIZED = 'UNAUTHORIZED',

  // BadRequestException (400): 클라이언트의 요청이 잘못된 형식이거나 필수 매개변수가 빠졌을 때 발생.
  BAD_REQUEST = 'BAD_REQUEST',

  //NotFoundException (404): 요청한 자원이 존재하지 않을 때 발생.
  NOT_FOUND = 'NOT_FOUND',

  // ForbiddenException (403): 클라이언트가 해당 자원에 대한 권한이 없을 때 발생.
  FORBIDDEN = 'FORBIDDEN',

  // ConflictException (409): 중복된 데이터가 존재할 때 발생 (예: 고유 값 중복).
  CONFLICT = 'CONFLICT ',

  // INTERNAL_SERVER_ERROR (500): 서버에러
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}
