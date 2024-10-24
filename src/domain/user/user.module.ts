import { Module } from '@nestjs/common';
import { UserController } from './interface/controller/user.controller';
import { UserService } from './application/service/user.service';
import User from './domain/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import Point from './domain/entity/point.entity';
import { UserRepositoryImpl } from './infrastructure/database/userRepository.impl';
import { CreateUserUsecase } from './application/usecase/createUser.usecase';
import { PointChargeUsecase } from './application/usecase/pointCharge.usecase';
import { PointService } from './application/service/point.service';
import { PointRepositoryImpl } from './infrastructure/database/pointRepository.impl';
import { FindPointUsecase } from './application/usecase/findPoint.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([User, Point])],
  controllers: [UserController],
  providers: [
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
