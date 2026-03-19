import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// main con swagger
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));

  const config = new DocumentBuilder()
    .setTitle('Api en NestJS con MongoDB')
    .setDescription('Descripcion de la App')
    .setVersion('1.0')
    .addTag('App')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();


// Sin swagger
// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.useGlobalPipes(new ValidationPipe());

//   await app.listen(process.env.PORT ?? 3000);
// }

