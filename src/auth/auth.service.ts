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
  EmailDoNotExistOnReset,
  EmailDoNotExistOnVerify,
  ResetTokenWasUsed,
  TokensMismatchError,
} from './../errors/auth-exceptions';
import { UsersService } from 'src/@repository/users/prisma-users';
import { PendingUserService } from './other-services/pending-user.service';
import { VerifyPasswordResetRepository } from './other-services/reset-password.service';
import { PrismaService } from 'src/@repository/prisma.service';
import { HashService } from './other-services/hash-service';

@Injectable()
export class AuthService {
  HashService = new HashService();

  constructor(
    private userRepository: UsersService,
    private pendingUserRepository: PendingUserService,
    private passwordResetRepository: VerifyPasswordResetRepository,
    private jwtService: JwtService,
    private prisma: PrismaService,
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

  private async validateResetToken(token: string) {
    const data = await this.passwordResetRepository.getResetToken(token);

    if (!data) throw new EmailDoNotExistOnReset();
    if (data.used) throw new ResetTokenWasUsed();

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    if (data.createdAt < fiveMinutesAgo)
      throw new BadRequestException('Token expired');

    return token;
  }

  async verify(body: VerifyUserDto) {
    const existingUser = await this.userRepository.findByEmail({
      email: body.email,
    });

    if (existingUser) {
      throw new EmailAlreadyExistsError();
    }

    const data = await this.pendingUserRepository.findPendingUser(body.email);

    if (!data) throw new EmailDoNotExistOnVerify();

    if (data.token !== body.token) throw new TokensMismatchError();

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

    const isMatch = await this.HashService.unhash(password, data.passwordHash);

    if (!isMatch) {
      console.error("password don't match");
      throw new InternalServerErrorException('Invalid credentials');
    }

    const payload = { sub: data.id, user: data.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async requestPasswordReset(email: string) {
    const existingUser = await this.userRepository.findByEmail({
      email,
    });

    if (existingUser) {
      const token = await this.passwordResetRepository.createResetToken(
        existingUser.email,
        existingUser.id,
      );
      // TODO: send token to user email
    }

    return {
      message:
        'Successful. Sent a password reset token if this email exist with us',
      email,
    };
  }

  async confirmResetToken(token: string) {
    const secure_token = await this.validateResetToken(token);
    return {
      message: 'Successful.',
      secure_token,
    };
  }

  async ResetPassword(email: string, passwordTxt: string, token: string) {
    const existingUser = await this.userRepository.findByEmail({
      email,
    });

    if (!existingUser) throw new UnauthorizedException('Unauthorized user');

    await this.validateResetToken(token);

    const passwordHash = await this.HashService.hash(passwordTxt);
    await this.prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        passwordHash,
      },
    });

    await this.prisma.verifyPasswordReset.update({
      where: { token },
      data: { used: true },
    });

    return {
      message: 'Password reset successful.',
    };
  }
}
