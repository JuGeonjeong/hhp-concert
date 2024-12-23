import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { applyDecorators, Type } from '@nestjs/common';
// import { baseResponse } from '../dto/responseSuccess.dto';

// export class DataResponse<T> extends baseResponse {
//   data: T;
// }

export const ApiDataResponse = <TModel extends Type<unknown>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiOkResponse({
      description: '성공',
      schema: {
        allOf: [
          {
            properties: {
              statusCode: {
                description: '상태코드',
                default: 200,
                type: 'number',
              },
              message: {
                description: '서버메시지',
                default: 'success',
                type: 'string',
              },
              data: {
                description: 'data',
                type: 'object',
                $ref: getSchemaPath(model),
              },
            },
          },
        ],
      },
    }),
    ApiExtraModels(model),
  );
};
