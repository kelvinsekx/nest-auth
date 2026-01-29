import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

import { CreateUserDto, VerifyUserDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import {
  EmailAlreadyExistsError,
  TokensMismatchError,
} from './../core/errors/auth-exceptions';
import { UsersService } from 'src/@repository/users/prisma-users';
import { PendingUserService } from './other-services/pending-user.service';
import { VerifyPasswordResetRepository } from './other-services/reset-password.service';
import { HashService } from './other-services/hash-service';
import { PasswordService } from './other-services/password.service';

@Injectable()
export class AuthService {
  HashService = new HashService();

  constructor(
    private userRepository: UsersService,
    private pendingUserRepository: PendingUserService,
    private passwordResetRepository: VerifyPasswordResetRepository,
    private jwtService: JwtService,
    private passwordService: PasswordService,
  ) {}

  async create(body: CreateUserDto) {
    const existingUser = await this.userRepository.findByEmail({
      email: body.email,
    });

    if (existingUser) {
      throw new EmailAlreadyExistsError();
    }

    const passwordHash = await this.HashService.hash(body.password);

    await this.pendingUserRepository.createPendingUser(
      body.email,
      passwordHash,
    );

    return {
      message: 'Successful. Proceed to verify email',
    };
  }

  async verify(body: VerifyUserDto) {
    const existingUser = await this.userRepository.findByEmail({
      email: body.email,
    });

    if (existingUser) {
      throw new EmailAlreadyExistsError();
    }

    const data = await this.pendingUserRepository.findPendingUser(body.email);

    // TOD: if user has been pending for 25 hours deactivate

    if (data.token !== body.token) throw new TokensMismatchError();

    // TOD: time safe comparison for token

    await this.userRepository.create({
      email: data.email,
      passwordHash: data.passwordHash,
      emailVerified: true,
    });

    await this.pendingUserRepository.delete(body.email);

    return {
      message: 'User created successfully',
      email: body.email,
    };
  }

  async login(body: CreateUserDto) {
    const { email, password } = body;
    const data = await this.userRepository.findByEmail({ email });

    if (!data) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await this.HashService.compare(password, data.passwordHash);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: data.id, user: data.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async requestPasswordReset(email: string) {
    const token = await this.passwordResetRepository.createResetToken(email);

    // TODO: send user token over an email

    return {
      message:
        'Successful. Sent a password reset token if this email exist with us',
      email,
    };
  }

  async confirmResetToken(token: string) {
    await this.passwordResetRepository.confirmTokenValidity(token);
    return {
      message: 'Successful.',
      token,
    };
  }

  async resetPassword(email: string, passwordTxt: string, token: string) {
    await this.passwordResetRepository.confirmTokenValidity(token);

    await this.passwordService.updatePassword(email, passwordTxt);

    await this.passwordResetRepository.setTokenUsed(token);

    return {
      message: 'Password reset successful.',
    };
  }
}
