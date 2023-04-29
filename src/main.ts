import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use validation with dto
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
  console.log(`Ip: ${await app.getUrl()}`);
}
bootstrap();
