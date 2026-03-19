import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

// Ejemplo de un middleware para loguear las rutas a las que se estan accediendo, este se ejecutara antes de llegar al controlador
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    console.log('middleware', req.originalUrl);

    next();
  }
}
