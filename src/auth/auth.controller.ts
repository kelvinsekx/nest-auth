import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateUserDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  /**
   */
  // auth/signup
  @Post('signup')
  async signup(@Body() body: CreateUserDto) {
    return await this.authService.create(body);
  }

  // auth/login
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: Pick<CreateUserDto, 'email' | 'password'>) {
    return await this.authService.login(signInDto);
  }
}
