import {
  Controller,
  Get,
  HttpCode,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import express from 'express';
import { ValidateuserPipe } from './pipes/validateuser/validateuser.pipe';
import { AuthGuard } from './guards/auth/auth.guard';

@Controller()
export class HelloController {
  @Get('/hello')
  index(@Req() request: express.Request, @Res() response: express.Response) {
    console.log(request.url);
    response.status(200).json({
      message: 'Hello World',
    });
  }

//manejo de status code http
  @Get('new')
  @HttpCode(201)
  somethingNew() {
    return 'Something new';
  }

  @Get('notfound')
  @HttpCode(404)
  notFoundPage() {
    return '404 not found';
  }

  @Get('error')
  @HttpCode(500)
  errorPage() {
    return 'Error Route!!';
  }

//PIPES
//los pipes se ejecutan antes de llegar al controlador, se pueden usar para validar o transformar los datos de entrada
// ParseIntPipe: convierte el string 'num' a un número entero, si no se puede convertir, lanza una excepción
  @Get('ticket/:num')
  getNumber(@Param('num', ParseIntPipe) num: number) {
    console.log(typeof num);
    return num + 14;
  }

  //Pipes para manejar datos booleanos 
  @Get('active/:status')
  @UseGuards(AuthGuard)
  isUserActive(@Param('status', ParseBoolPipe) status: boolean) {
    console.log(typeof status);
    return status;
  }
//Pipes personalizados para validar los datos de entrada, el nombre y la edad un usuario
  @Get('greet')
  @UseGuards(AuthGuard) //Usamos el guard para proteger la ruta, solo los usuarios autenticados pueden acceder a esta ruta
  greet(@Query(ValidateuserPipe) query: { name: string; age: number }) {
    console.log(typeof query.age);
    console.log(typeof query.name);
    return `Hello ${query.name}, you are ${query.age + 30} years old`;
  }
}
