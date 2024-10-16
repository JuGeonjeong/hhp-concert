import { Module } from '@nestjs/common';
import { UserController } from './interface/controller/user.controller';
import { UserService } from './application/service/user.service';
import { User } from './domain/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Point } from './domain/entity/point.entity';
import { PointHistory } from './domain/entity/pointHistory.entity';
import { UserRepositoryImpl } from './infrastructure/database/userRepository.impl';
import { CreateUserUsecase } from './application/usecase/createUser.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([User, Point, PointHistory])],
  controllers: [UserController],
  providers: [
    {
      provide: 'IUserRepository',
      useClass: UserRepositoryImpl,
    },
    UserService,
    CreateUserUsecase,
  ],
})
export class UserModule {}
