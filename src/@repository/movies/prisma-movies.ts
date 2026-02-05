import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { Prisma } from 'src/generated/prisma/client';
/**
 *
 */
@Injectable()
export class PrismaMoviesRepository {
  constructor(private readonly prisma: PrismaService) {}
  async getAllMovies() {
    return await this.prisma.movie.findMany();
  }
  async getOneMovie(id: string) {
    return await this.prisma.movie.findUnique({
      where: { id },
    });
  }
  async createNewMovie(data: Prisma.MovieCreateInput) {
    return this.prisma.movie.create({ data });
  }

  async updateMovie(id: string, data: Prisma.MovieCreateInput) {
    return this.prisma.movie.update({
      where: { id },
      data,
    });
  }
  async removeMovie(id: string) {
    return this.prisma.movie.delete({
      where: { id },
    });
  }

  async searchMovie(query: string) {
    return this.prisma.movie.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      take: 20,
    });
  }
}
