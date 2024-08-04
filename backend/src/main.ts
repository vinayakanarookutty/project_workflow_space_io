/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  

  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  app.enableCors();
   const config = new DocumentBuilder()
  .setTitle('Cloud APS')
  .setDescription('The API description')
  .setVersion('1.0')
  .addTag('APS')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(port);
   Logger.log(
    `🚀 Application is running on: http://localhost:3000/`
  );
}
bootstrap();
