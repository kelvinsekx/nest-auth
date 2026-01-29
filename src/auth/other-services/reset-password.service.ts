import { BadRequestException, Injectable } from '@nestjs/common';
import { VerificationService } from '../verification-service/verification.service';
import { PrismaService } from 'src/@repository/prisma.service';
import {
  EmailDoNotExistOnReset,
  ResetTokenWasUsed,
} from 'src/core/errors/auth-exceptions';

@Injectable()
export class VerifyPasswordResetRepository {
  constructor(
    private readonly policy: VerificationService,
    private readonly prisma: PrismaService,
  ) {}

  async createResetToken(email: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, passwordHash: true },
    });

    if (!existingUser) return;

    const token = this.policy.generateCode(email, 'reset');

    await this.prisma.verifyPasswordReset.create({
      data: {
        token,
        userId: existingUser.id,
      },
    });

    return token;
  }

  async confirmTokenValidity(token: string) {
    const resetResult = await this.prisma.verifyPasswordReset.findFirst({
      where: {
        token,
      },
      select: {
        used: true,
        createdAt: true,
        token: true,
      },
    });

    if (!resetResult) throw new EmailDoNotExistOnReset();
    if (resetResult.used) throw new ResetTokenWasUsed();

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    if (resetResult.createdAt < fiveMinutesAgo)
      throw new BadRequestException('Token expired');

    return {
      token,
    };
  }

  async setTokenUsed(token: string) {
    await this.prisma.verifyPasswordReset.update({
      where: { token },
      data: { used: true },
    });
  }
}
