import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Swagger 세팅
 *
 * @param {INestApplication} app
 */
export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle(`${process.env.PROJECT_NAME} API Docs`)
    .setDescription(
      `${process.env.PROJECT_NAME}의 API 문서입니다.
  
  업데이트 내역
`,
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        in: 'header',
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Access JWT',
        description: 'Enter JWT token',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      defaultModelsExpandDepth: 0,
      // , docExpansion: 'none'
    },
    customSiteTitle: process.env.PROJECT_NAME,
  });
}
