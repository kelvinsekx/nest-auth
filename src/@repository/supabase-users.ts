import { SupabaseService } from 'src/supabase/supabase.service';
import { UsersRepository } from './users';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

export class SupabaseUsersRepository implements UsersRepository {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findByEmail(email: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('users')
      .select('email, password, userId')
      .eq('email', email)
      .single();

    if (error) {
      throw new InternalServerErrorException('Database error.');
    }

    return data || null;
  }

  async create(data: { email: string; password: string }) {
    const { error } = await this.supabaseService
      .getClient()
      .from('users')
      .insert(data);

    if (error) {
      console.error('Supabase insertion error:', error);
      throw new InternalServerErrorException(
        'Failed to create user in the database.',
      );
    }
  }
}
