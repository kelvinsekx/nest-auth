import { Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma.service';
import { UsersRepository } from './users.interface';
import { Prisma, User } from 'src/generated/prisma/client';

@Injectable()
export class UsersService implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<Omit<User, 'username' | 'createdAt'> | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      select: { id: true, email: true, password: true },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<Pick<User, 'email'>> {
    return this.prisma.user.create({
      data,
    });
  }
}
