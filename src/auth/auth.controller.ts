import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Query,
} from '@nestjs/common';
import { CreateUserDto, PasswordReset, VerifyUserDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: CreateUserDto) {
    return await this.authService.create(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: CreateUserDto) {
    return await this.authService.login(signInDto);
  }

  @Post('verify')
  async verify(@Body() signInDto: VerifyUserDto) {
    return await this.authService.verify(signInDto);
  }

  @Get('request-reset')
  async RequestPasswordReset(@Query('email') email: string) {
    return await this.authService.requestPasswordReset(email);
  }

  @Post('confirm-reset-token')
  async ConfirmPasswordReset(@Body() body: VerifyUserDto) {
    return await this.authService.confirmResetToken(body.token);
  }

  @Post('reset-password')
  async ResetPassword(@Body() body: PasswordReset) {
    return await this.authService.ResetPassword(
      body.email,
      body.password,
      body.token,
    );
  }
}
