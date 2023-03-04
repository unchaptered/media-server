import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './middlewares/exception.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      allowedHeaders: ['Authorization', 'ServerKey', 'AdminKey'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTION'],
      origin: '*',
    }
  });
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('/api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );
  app.useGlobalFilters(
    new HttpExceptionFilter()
  );
  await app.listen(configService.get('PORT') ?? 3000);
}
bootstrap();