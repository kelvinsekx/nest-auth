import { Injectable } from '@nestjs/common';
import { VerificationService } from '../verification-service/verification.service';
import { PrismaService } from 'src/@repository/prisma.service';

@Injectable()
export class VerifyPasswordResetRepository {
  constructor(
    private readonly policy: VerificationService,
    private readonly prisma: PrismaService,
  ) {}

  async createResetToken(email: string, userId: string) {
    const token = this.policy.generateCode(email, 'reset');
    // TODO: send user token over an email

    await this.prisma.verifyPasswordReset.create({
      data: {
        token,
        userId,
      },
    });

    return token;
  }

  async getResetToken(token: string) {
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

    if (!resetResult) return null;

    return {
      used: resetResult.used,
      createdAt: resetResult.createdAt,
    };
  }
}
