import { Module } from '@nestjs/common';
import { UserController } from './interface/controller/user.controller';
import User from './domain/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import Point from './domain/entity/point.entity';
import { CreateUserUsecase } from './application/usecase/createUser.usecase';
import { PointChargeUsecase } from './application/usecase/pointCharge.usecase';
import { FindPointUsecase } from './application/usecase/findPoint.usecase';
import { PointService } from './domain/service/point.service';
import { UserService } from './domain/service/user.service';
import { PointRepositoryImpl } from './infrastructure/pointRepository.impl';
import { UserRepositoryImpl } from './infrastructure/userRepository.impl';

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
