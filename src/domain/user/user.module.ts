import { Module } from '@nestjs/common';
import { UserController } from './interface/api/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepositoryImpl } from './infrastructure/repository/user.repository.impl';
import { CreateUserUsecase } from './application/usecase/createUser.usecase';
import { PointChargeUsecase } from './application/usecase/pointCharge.usecase';
import { PointRepositoryImpl } from './infrastructure/repository/point.repository.impl';
import { FindPointUsecase } from './application/usecase/findPoint.usecase';
import PointEntity from './infrastructure/entity/point.entity';
import UserEntity from './infrastructure/entity/user.entity';
import PointHistoryEntity from './infrastructure/entity/point-history.entity';
import { PointService } from './domain/service/point.service';
import { UserService } from './domain/service/user.service';
import { UserFacade } from './application/user.facade';
import { UserFacadeImpl } from './application/user.facade.impl';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, PointEntity, PointHistoryEntity]),
  ],
  controllers: [UserController],
  providers: [
    {
      provide: UserFacade,
      useClass: UserFacadeImpl,
    },
    {
      provide: 'IUserRepository',
      useClass: UserRepositoryImpl,
    },
    {
      provide: 'IPointRepository',
      useClass: PointRepositoryImpl,
    },
    UserService,
    PointService,
    CreateUserUsecase,
    PointChargeUsecase,
    FindPointUsecase,
  ],
})
export class UserModule {}
