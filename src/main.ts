import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { VersioningType } from '@nestjs/common';
import { setupSwagger } from './common/config/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(cookieParser('secretKey'));

  app.enableVersioning({
    type: VersioningType.URI, // URI에 버전을 추가하는 방식
  });

  await app.listen(3000);
}
bootstrap();
