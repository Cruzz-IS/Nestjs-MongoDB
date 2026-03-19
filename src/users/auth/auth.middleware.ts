import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response } from 'express';

//Middleware para proteger las rutas de /users si no tiene el token de autorizacion en el header.
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    if (authorization !== 'xyz123') {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    next();
  }
}
