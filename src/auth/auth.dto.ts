import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Trim } from 'src/common/transformers/trim.transformer';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @Transform(Trim)
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;
}

export class VerifyeUserDto {
  @IsEmail()
  email: string;

  @IsString()
  token: string;
}
