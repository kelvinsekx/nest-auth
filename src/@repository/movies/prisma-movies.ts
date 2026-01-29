import { Injectable } from '@nestjs/common';
import { MoviesRepository } from './movies.interface';

import { PrismaService } from '../prisma.service';
import { Prisma } from 'src/generated/prisma/client';
/**
 *
 */
@Injectable()
export class PrismaMoviesRepository implements MoviesRepository {
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
    try {
      return this.prisma.movie.create({ data });
    } catch (error) {
      throw Error(error);
    }
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
