import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  /**
   */
  // auth/signup
  @Post('signup')
  signup(@Body() body: CreateUserDto) {
    return this.authService.create(body);
  }
}
