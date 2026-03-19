import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';


//Ejemplo de un guard para protejer una ruta si no tiene un token de autorizacion en el header.
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    console.log(request.url);

    if (!request.headers['authorization']) return false;

    return true;
  }
}
