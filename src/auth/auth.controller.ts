import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  /**
   */
  // auth/signup
  @Post('signup')
  signup(@Body() body: CreateUserDto) {
    return body;
  }
}
