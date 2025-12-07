import { Injectable, InternalServerErrorException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CreateUserDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(private supabaseService: SupabaseService) {}

  async create(body: CreateUserDto) {
    const saltRounds = 14;
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);

    const { error } = await this.supabaseService
      .getClient()
      .from('users')
      .insert({
        email: body.email,
        password: hashedPassword,
      });

    if (error) {
      console.error('Supabase insertion error:', error);
      throw new InternalServerErrorException(
        'Failed to create user in the database.',
      );
    }

    return {
      message: 'User created successfully',
      email: body.email,
    };
  }
}
