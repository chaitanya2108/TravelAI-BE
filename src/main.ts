import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';

async function bootstrap() {
  // 1) create an Express-based Nest app
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 2) enable DTO validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // 3) serve uploaded files from /uploads at http://host:port/uploads/...
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // 4) Swagger setup
  const config = new DocumentBuilder()
    .setTitle('TravelAI APIs')
    .setDescription('CRUD + media uploads')
    .setVersion('1.0')
    .build();
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, doc);

  // 5) listen
  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
