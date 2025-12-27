import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CreateUserDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private supabaseService: SupabaseService,
    private jwtService: JwtService,
  ) {}

  async hash(plainText): Promise<string> {
    const saltRounds = 14;
    return await bcrypt.hash(plainText, saltRounds);
  }

  async unhash(password, hash): Promise<boolean> {
    return await bcrypt.compare(hash, password);
  }

  async create(body: CreateUserDto) {
    const { data } = await this.supabaseService
      .getClient()
      .from('users')
      .select('*')
      .eq('email', body.email);

    if (data?.length) {
      throw new ConflictException('User with this email already exists.');
    }
    const hashedPassword = await this.hash(body.password);
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

  async login(body: Pick<CreateUserDto, 'email' | 'password'>) {
    // 1. Get login credentials from Request Body
    // 2. Validate input data:: done with Pick<T, K> above
    const { email, password } = body;
    // 3. Fetch user by email/username
    const { data } = await this.supabaseService
      .getClient()
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    //4. If user not found - return generic "invalid credentials"
    if (!data) throw new UnauthorizedException('Invalid credentials');

    // 5. Compare password with hashed password
    const isMatch = this.unhash(password, data.password);

    if (!isMatch) {
      // 6. If password mismatch, return generic "invalid credentials"
      console.error("password don't match");
      throw new InternalServerErrorException('Invalid credentials');
    }

    // 7. Generate authentication token (JWT / session / OAuth)
    const payload = { sub: data.userId, user: data.email };
    // 8. Return success response with tokens & user info (sanitized)
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
