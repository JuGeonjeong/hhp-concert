import { ApiProperty } from '@nestjs/swagger';

interface ISuccess<T> {
  readonly statusCode?: number;
  readonly message?: string;
  readonly data?: T;
}

export class baseResponse {
  @ApiProperty({ description: '상태코드', default: 200 })
  statusCode: number;

  @ApiProperty({ description: '서버메시지', default: 'success' })
  message: string;
}

export class ResponseSuccessDto<T> extends baseResponse {
  readonly data?: Array<T> | T;

  constructor(data?: ISuccess<T>) {
    super();
    this.statusCode = data.statusCode;
    this.message = data?.message ?? 'success';
    this.data = data?.data;
  }
}
