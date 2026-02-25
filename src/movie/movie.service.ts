import { Injectable } from '@nestjs/common';
import {
  PrismaMoviesRepository,
  type TSearchQ,
} from 'src/@repository/movies/prisma-movies';
import { SearchService } from 'src/core/common/services/search.service';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class MovieService {
  constructor(
    private movieRepository: PrismaMoviesRepository,
    private readonly searchService: SearchService,
  ) {}

  async getAllMovies() {
    return await this.movieRepository.getAllMovies();
  }

  async findOne(movieWhereUnique: Prisma.MovieWhereUniqueInput) {
    return await this.movieRepository.getOneMovie(movieWhereUnique);
  }

  async createNewMovie(movieInput: Prisma.MovieCreateInput) {
    return await this.movieRepository.createNewMovie(movieInput);
  }

  async updateMovie(id: string, movie) {
    const updatedMovie = await this.movieRepository.updateMovie(id, movie);
    return updatedMovie;
  }

  async removeMovie(id: string) {
    await this.movieRepository.removeMovie(id);
  }

  async search({ query, take, skip }: TSearchQ) {
    return await this.searchService.searchMovies({ query, take, skip });
  }
}
