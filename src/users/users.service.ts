import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/@repository/prisma.service';
import { Prisma, User } from 'src/generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
    const existingUser = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      select: { id: true, email: true, passwordHash: true },
    });

    return existingUser;
  }

  async create(data: Prisma.UserCreateInput): Promise<Pick<User, 'email'>> {
    return this.prisma.user.create({
      data,
    });
  }
}
