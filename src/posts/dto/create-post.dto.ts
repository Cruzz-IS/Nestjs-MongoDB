import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  readonly title!: string;

  @IsString()
  @IsNotEmpty()
  readonly content!: string;

  @IsMongoId({ message: 'El ID del autor debe ser un ID de MongoDB válido' })
  @IsNotEmpty()
  readonly author!: string;
}
