import { Inject } from '@nestjs/common';
import { CreateTokenUsecase } from './usecase/createToken.usecase';
import { QueueFacade } from './queue.facade';
import { CheckTokenUsecase } from './usecase/checkToken.usecase';
import { OutTokenUsecase } from './usecase/outToken.usecase';

export class QueueFacadeImpl implements QueueFacade {
  constructor(
    @Inject(CreateTokenUsecase)
    private readonly createTokenUseCase: CreateTokenUsecase,
    @Inject(CheckTokenUsecase)
    private readonly checkTokenUseCase: CheckTokenUsecase,
    @Inject(OutTokenUsecase)
    private readonly outTokenUseCase: OutTokenUsecase,
  ) {}

  /**
   * @see {QueueFacade.createToken}
   */
  createToken(): Promise<any> {
    return this.createTokenUseCase.create();
  }

  /**
   * @see {QueueFacade.checkToken}
   */
  checkToken(token: any): Promise<any> {
    return this.checkTokenUseCase.check(token);
  }

  /**
   * @see {QueueFacade.outToken}
   */
  outToken(token: any): Promise<any> {
    return this.outTokenUseCase.update(token);
  }
}
