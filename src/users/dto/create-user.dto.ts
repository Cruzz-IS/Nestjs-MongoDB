import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString, Max, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'usuario@test.com' })
  @IsEmail({}, { message: 'Email inválido' })
  @IsString()
  @IsNotEmpty()
  readonly email!: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  readonly password!: string;

  @ApiProperty({ example: 'Usuario de Prueba' })
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @ApiProperty({ example: 22})
  @IsNumber()
  @Max(100)
  readonly age?: number;
}
