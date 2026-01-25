import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/@repository/prisma.service';
import { HashService } from './hash-service';

@Injectable()
export class PasswordService {
  hashService = new HashService();
  constructor(private readonly prisma: PrismaService) {}

  async updatePassword(email: string, passwordTxt: string) {
    const passwordHash = await this.hashService.hash(passwordTxt);
    await this.prisma.user.update({
      where: {
        email,
      },
      data: {
        passwordHash,
      },
    });
  }
}
