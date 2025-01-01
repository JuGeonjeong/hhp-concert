import { Inject } from '@nestjs/common';
import { UserFacade } from './user.facade';
import { CreateUserUsecase } from './usecase/createUser.usecase';
import { PointChargeUsecase } from './usecase/pointCharge.usecase';
import { FindPointUsecase } from './usecase/findPoint.usecase';

export class UserFacadeImpl implements UserFacade {
  constructor(
    @Inject(CreateUserUsecase)
    private readonly createUserUseCase: CreateUserUsecase,
    @Inject(PointChargeUsecase)
    private readonly pointChargeUsecase: PointChargeUsecase,
    @Inject(FindPointUsecase)
    private readonly findPointUsecase: FindPointUsecase,
  ) {}

  /**
   * @see {UserFacade.createUser}
   */
  createUser(aggregate: any): Promise<any> {
    return this.createUserUseCase.createUser(aggregate);
  }

  /**
   * @see {UserFacade.charge}
   */
  charge(aggregate: any): Promise<any> {
    return this.pointChargeUsecase.charge(aggregate);
  }

  /**
   * @see {UserFacade.findOne}
   */
  findOne(aggregate: any): Promise<any> {
    return this.findPointUsecase.findOne(aggregate);
  }
}
