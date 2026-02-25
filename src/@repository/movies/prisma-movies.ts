import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { Prisma } from 'src/generated/prisma/client';
/**
 * TYPES
 */
export type TSearchQ = {
  query: string;
  skip?: number;
  take?: number;
};

@Injectable()
export class PrismaMoviesRepository {
  constructor(private readonly prisma: PrismaService) {}
  async getAllMovies() {
    return await this.prisma.movie.findMany();
  }
  async getOneMovie(movieWhereUnique: Prisma.MovieWhereUniqueInput) {
    return await this.prisma.movie.findUnique({
      where: movieWhereUnique,
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
}
