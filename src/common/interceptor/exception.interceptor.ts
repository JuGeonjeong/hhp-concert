import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoggerService } from '../logger/logger.service';
// import { ApplicationException } from '../exception/application.exception';

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {
    this.logger.setTarget(this.constructor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) =>
        throwError(() => {
          if (err instanceof HttpException) {
            this.logger.debug(err);
            return err;
            // } else if (err instanceof ApplicationException) {
            //   this.logger.debug(err);
            //   return err.toHttpException();
          } else {
            this.logger.error(err);
            return new InternalServerErrorException();
          }
        }),
      ),
    );
  }
}
