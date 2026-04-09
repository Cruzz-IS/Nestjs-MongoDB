import { ApiProperty } from '@nestjs/swagger';
import { IsString, min, MinLength} from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ example: 'tarea 1' })
  @IsString()
  @MinLength(1)
  title?: string;

  @ApiProperty({ example: 'tarea de prueba' })
  @IsString()
  @MinLength(1)
  description?: string;
}
