import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { CreateUserDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { USERS_REPOSITORY, type UsersRepository } from 'src/@repository/users';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private userRepository: UsersRepository,
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
    const data = await this.userRepository.findByEmail(body.email);

    if (!data) {
      throw new ConflictException('User with this email already exists.');
    }

    const hashedPassword = await this.hash(body.password);
    await this.userRepository.create({
      email: body.email,
      password: hashedPassword,
    });

    return {
      message: 'User created successfully',
      email: body.email,
    };
  }

  async login(body: Pick<CreateUserDto, 'email' | 'password'>) {
    const { email, password } = body;
    const data = await this.userRepository.findByEmail(email);

    if (!data) throw new UnauthorizedException('Invalid credentials');

    const isMatch = this.unhash(password, data.password);

    if (!isMatch) {
      console.error("password don't match");
      throw new InternalServerErrorException('Invalid credentials');
    }

    const payload = { sub: data.userId, user: data.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
