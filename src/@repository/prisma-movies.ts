import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { MoviesRepository } from './movies.repository';
import { InputMovie, Movie } from 'src/movie/movie.interface';
/**
 *
 */
@Injectable()
export class PrismaMoviesRepository implements MoviesRepository {
  constructor(private readonly prisma: PrismaService) {}
  async getAllMovies() {
    return await this.prisma.movie.findMany();
  }
  async getOneMovie(id: number) {
    return await this.prisma.movie.findUnique({
      where: { id },
    });
  }
  async createNewMovie(data: InputMovie) {
    return this.prisma.movie.create({ data });
  }
  async updateMovie(id: number, data: Movie) {
    return this.prisma.movie.update({
      where: { id },
      data,
    });
  }
  async removeMovie(id: number) {
    return this.prisma.movie.delete({
      where: { id },
    });
  }
}
