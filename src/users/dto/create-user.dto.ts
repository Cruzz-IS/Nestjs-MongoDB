import { IsEmail, IsNotEmpty, IsNumber, IsString, Max, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email inválido' })
  @IsString()
  @IsNotEmpty()
  readonly email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  readonly password!: string;

  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsNumber()
  @Max(100)
  readonly age?: number;
}
