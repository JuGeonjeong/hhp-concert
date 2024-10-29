import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService extends ConsoleLogger {
  private target: string;

  constructor() {
    super();
    this.setTarget(this.constructor.name);
  }

  setTarget(target: string) {
    this.target = target;
  }

  log(message: unknown) {
    const input =
      typeof message === 'string' || typeof message === 'number'
        ? message
        : JSON.stringify(message);
    super.log(input, this.target);
  }

  debug(message: unknown) {
    const input =
      typeof message === 'string' || typeof message === 'number'
        ? message
        : JSON.stringify(message);
    super.debug(input, this.target);
  }

  warn(message: unknown) {
    const input =
      typeof message === 'string' || typeof message === 'number'
        ? message
        : JSON.stringify(message);
    super.warn(input, this.target);
  }

  error(error: Error | string) {
    const message = typeof error === 'string' ? error : error.message;
    const stack = error instanceof Error ? error.stack : undefined;
    super.error(message, stack, this.target);
  }
}
