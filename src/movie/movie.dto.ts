import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Trim } from 'src/core/common/transformers/trim.transformer';

import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({
    description: 'title of the movie',
    example: 1,
  })
  @Transform(Trim)
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Year the movie was released',
    example: 2008,
  })
  @Transform(Trim)
  @IsNumber()
  @IsNotEmpty()
  releaseYear: number;
}

export class UpdateMovieDTO {
  @Transform(Trim)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title: string;

  @Transform(Trim)
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  releaseYear: number;
}
