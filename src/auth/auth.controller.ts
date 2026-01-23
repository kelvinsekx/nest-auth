import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  InternalServerErrorException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, VerifyeUserDto } from './auth.dto';
import { AuthService } from './auth.service';

import {
  EmailAlreadyExistsError,
  EmailDoNotExistOnVerify,
  TokensMismatchError,
} from './../errors/auth-exceptions';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  /**
   */
  // auth/signup
  @Post('signup')
  async signup(@Body() body: CreateUserDto) {
    try {
      return await this.authService.create(body);
    } catch (error) {
      if (error instanceof EmailAlreadyExistsError) {
        throw new ConflictException('Email already exists');
      }
      throw new InternalServerErrorException(
        'Something went wrong on our side. Try again',
      );
    }
  }

  // auth/login
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: CreateUserDto) {
    try {
      return await this.authService.login(signInDto);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        // Invalid because the user isn't verified yet
        throw new ConflictException('Invalid');
      }
      throw new InternalServerErrorException(
        'Something went wrong on our side. Try again',
      );
    }
  }

  // auth/verify
  @Post('verify')
  async verify(@Body() signInDto: VerifyeUserDto) {
    try {
      return await this.authService.verify(signInDto);
    } catch (error) {
      if (error instanceof EmailAlreadyExistsError) {
        throw new ConflictException('Email already exists');
      }
      if (error instanceof EmailDoNotExistOnVerify) {
        throw new ConflictException('Email do not exist');
      }
      if (error instanceof TokensMismatchError) {
        throw new ConflictException("Tokens don't match");
      }
      throw new InternalServerErrorException(
        'Something went wrong on our side. Try again',
      );
    }
  }
}
