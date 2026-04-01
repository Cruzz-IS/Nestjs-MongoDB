import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {
  @IsEmail({}, { message: 'Por favor ingrese un correo válido' })
  email!: string;
  
  @IsNotEmpty()
  password!: string;
}