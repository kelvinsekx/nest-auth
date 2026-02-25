import { PartialType } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';

export class CreateRentDto {
  @IsString()
  movieId;

  @IsDateString()
  rentedAt;

  @IsDateString()
  dueAt;
}

export class VerboseRentDto extends PartialType(CreateRentDto) {
  @IsString()
  userId;
}
