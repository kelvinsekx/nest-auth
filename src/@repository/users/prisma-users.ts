import { Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma.service';
import { Prisma, User } from 'src/generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      select: { id: true, email: true, passwordHash: true },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<Pick<User, 'email'>> {
    return this.prisma.user.create({
      data,
    });
  }
}
