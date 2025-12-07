import { Body, ConflictException, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './auth.dto';
import { AuthService } from './auth.service';
import { SupabaseService } from 'src/supabase/supabase.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private supabaseService: SupabaseService,
  ) {}
  /**
   */
  // auth/signup
  @Post('signup')
  async signup(@Body() body: CreateUserDto) {
    const { data } = await this.supabaseService
      .getClient()
      .from('users')
      .select('*')
      .eq('email', body.email);

    if (data?.length) {
      throw new ConflictException('User with this email already exists.');
    }

    return await this.authService.create(body);
  }
}
