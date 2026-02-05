import { Injectable } from '@nestjs/common';
import { PrismaMoviesRepository } from 'src/@repository/movies/prisma-movies';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class MovieService {
  constructor(private movieRepository: PrismaMoviesRepository) {}

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

  search(q: string) {
    return this.movieRepository.searchMovie(q);
  }
}
