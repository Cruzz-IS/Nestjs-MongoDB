import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import * as cookieParser from 'cookie-parser';

// main con swagger
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.use(cookieParser());

  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') ?? '*',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Api en NestJS con MongoDB')
    .setDescription('Descripcion de la App')
    .setVersion('1.0')
    .addTag('App')
    .addBearerAuth() // Permite probar el Access Token en Swagger
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Iniciando la API en el puerto→ http://localhost:${port}`);
}
bootstrap();

// Sin swagger
// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.useGlobalPipes(new ValidationPipe());

//   await app.listen(process.env.PORT ?? 3000);
// }
