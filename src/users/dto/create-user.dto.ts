import { IsEmail, IsNotEmpty, IsNumber, IsString, Max, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  readonly email: string | undefined;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  readonly password: string | undefined;

  @IsString()
  @IsNotEmpty()
  readonly name: string | undefined;

  @IsNumber()
  @Max(100)
  readonly age: number | undefined;
}
