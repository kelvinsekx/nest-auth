import { Injectable } from '@nestjs/common';
import { VerificationService } from '../verification-service/verification.service';
import { PrismaService } from 'src/@repository/prisma.service';
import crypto from 'node:crypto';

@Injectable()
export class VerifyPasswordResetRepository {
  constructor(
    private readonly policy: VerificationService,
    private readonly prisma: PrismaService,
  ) {}

  async createResetToken(email: string, userId: string) {
    const token = crypto.randomInt(1000, 10000).toString();
    // TODO: send user token over an email

    await this.prisma.verifyPasswordReset.create({
      data: {
        token,
        userId,
      },
    });

    return token;
  }

  async getResetToken(userId: string, token: string) {
    const resetResult = await this.prisma.verifyPasswordReset.findFirst({
      where: {
        token,
        userId,
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
