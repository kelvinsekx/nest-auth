import { Injectable } from '@nestjs/common';
import { VerificationService } from '../verification-service/verification.service';
import { PrismaService } from 'src/@repository/prisma.service';
import { EmailDoNotExistOnVerify } from 'src/errors/auth-exceptions';

@Injectable()
export class PendingUserService {
  constructor(
    private prisma: PrismaService,
    private policy: VerificationService,
  ) {}

  async createPendingUser(email: string, passwordHash: string) {
    const token = this.policy.generateCode(email);
    // TODO: send user token over an email
    const PendingUser = { email, passwordHash, token };

    await this.prisma.pendingUser.create({
      data: PendingUser,
    });
    return token;
  }

  async findPendingUser(email: string) {
    const pendingUserInput = { email };

    const data = await this.prisma.pendingUser.findUnique({
      where: pendingUserInput,
      select: {
        id: true,
        email: true,
        token: true,
        passwordHash: true,
        createdAt: true,
      },
    });

    if (!data) throw new EmailDoNotExistOnVerify();

    return data;
  }

  async delete(email: string) {
    return await this.prisma.pendingUser.delete({
      where: { email },
    });
  }
}
