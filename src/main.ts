import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

// import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // ValidationPipe 설정
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     transform: true, // 요청 데이터를 DTO 클래스로 자동 변환
  //     whitelist: true, // DTO에 정의된 값만 허용
  //     forbidNonWhitelisted: true, // 정의되지 않은 값이 있으면 에러 발생
  //   }),
  // );
  app.use(cookieParser('secretKey'));

  await app.listen(3000);
}
bootstrap();
