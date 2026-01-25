import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  InternalServerErrorException,
  ConflictException,
  UnauthorizedException,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto, PasswordReset, VerifyeUserDto } from './auth.dto';
import { AuthService } from './auth.service';

import {
  EmailAlreadyExistsError,
  EmailDoNotExistOnReset,
  EmailDoNotExistOnVerify,
  ResetTokenWasUsed,
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

  // auth/request-reset
  @Get('request-reset')
  async RequestPasswordReset(@Query('email') email: string) {
    try {
      return await this.authService.requestPasswordReset(email);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Something went wrong on our side. Try again',
      );
    }
  }

  // auth/confirm-reset-token
  @Post('confirm-reset-token')
  async ConfirmPasswordReset(@Body() body: VerifyeUserDto) {
    try {
      return await this.authService.confirmResetToken(body.email, body.token);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Unauthorized');
      }
      if (error instanceof EmailDoNotExistOnReset) {
        throw new UnauthorizedException('Request unauthorized');
      }
      if (error instanceof ResetTokenWasUsed) {
        throw new BadRequestException('Reset Token has been used');
      }
      if (error instanceof BadRequestException) {
        throw new BadRequestException('Reset Token expired');
      }
      throw new InternalServerErrorException(
        'Something went wrong on our side. Try again',
      );
    }
  }

  @Post('reset-password')
  async ResetPassword(@Body() body: PasswordReset) {
    try {
      return await this.authService.ResetPassword(
        body.email,
        body.password,
        body.token,
      );
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Unauthorized');
      }
      if (error instanceof EmailDoNotExistOnReset) {
        throw new UnauthorizedException('Request unauthorized');
      }
      if (error instanceof ResetTokenWasUsed) {
        throw new BadRequestException('Reset Token has been used');
      }
      if (error instanceof BadRequestException) {
        throw new BadRequestException('Reset Token expired');
      }
      throw new InternalServerErrorException(
        'Something went wrong on our side. Try again',
      );
    }
  }
}
