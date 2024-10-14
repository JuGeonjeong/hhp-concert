import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserService } from './application/service/user.service';
import { UserModule } from './infrastructure/module/user.module';
import { UserController } from './interface/controller/user.controller';

@Module({
  imports: [UserModule],
  controllers: [AppController, UserController],
  providers: [UserService],
})
export class AppModule {}
