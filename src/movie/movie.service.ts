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

  getAllMovies() {
    return this.movieRepository.getAllMovies();
  }

  getOneMovie(id: string) {
    return this.movieRepository.getOneMovie(id);
  }

  async createNewMovie(movieInput: Prisma.MovieCreateInput) {
    return await this.movieRepository.createNewMovie(movieInput);
  }

  updateMovie(id: string, movie) {
    const updatedMovie = this.movieRepository.updateMovie(id, movie);
    return updatedMovie;
  }

  removeMovie(id: string) {
    this.movieRepository.removeMovie(id);
  }

  search({ query, take, skip }: TSearchQ) {
    return this.searchService.searchMovies({ query, take, skip });
  }
}
