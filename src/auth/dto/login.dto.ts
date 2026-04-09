import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: 'prueba@example.com' })
  @IsEmail({}, { message: 'Por favor ingrese un correo válido' })
  email!: string;
  
  @ApiProperty({ example: '' })
  @IsNotEmpty()
  password!: string;
}