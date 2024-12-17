import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { VersioningType } from '@nestjs/common';
import { setupSwagger } from './common/config/swagger';
import { LoggerService } from './common/logger/logger.service';
// import { KAFKA_OPTION } from './common/kafka/kafka';
// import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // app.connectMicroservice<MicroserviceOptions>(KAFKA_OPTION);
  app.useLogger(new LoggerService());
  setupSwagger(app);
  app.use(cookieParser('secretKey'));

  app.enableVersioning({
    type: VersioningType.URI,
  });
  await app.startAllMicroservices();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
