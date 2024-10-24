import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import * as dayjs from 'dayjs';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const timestamp = dayjs().format('YYYY-MM-DD, hh:mm a');
    const status =
      exception instanceof HttpException ? exception.getStatus() : 404;

    this.logger.error(
      `HTTP ${status} Error: ${exception.message} - ${request.method} ${request.url}`,
    );
    // 리소스를 찾을 수 없을때
    if (exception.code !== 'ENOENT') {
      console.error(
        `[ERROR]
        ${timestamp} :
        ${request.url} :
        body => ${JSON.stringify(request.body, null, 2)}
        `,
        exception,
      );
      const message = exception.response?.message;
      response.status(status).json({
        statusCode: status,
        timestamp,
        path: request.url,
        message:
          message && Array.isArray(message)
            ? message.join(', ')
            : exception.message,
      });
    } else {
      response.status(status).json({
        statusCode: status,
        timestamp,
        path: request.url,
        message: 'Not Found!',
      });
    }
  }
}
