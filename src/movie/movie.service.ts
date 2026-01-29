import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  MOVIES_REPOSITORY,
  type MoviesRepository,
} from 'src/@repository/movies/movies.interface';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class MovieService {
  constructor(
    @Inject(MOVIES_REPOSITORY)
    private movieRepository: MoviesRepository,
  ) {}

  getAllMovies() {
    return this.movieRepository.getAllMovies();
  }

  getOneMovie(id: string) {
    return this.movieRepository.getOneMovie(id);
  }

  async createNewMovie(movieInput: Prisma.MovieCreateInput) {
    console.log('0');
    try {
      const { title, releaseYear } = movieInput;
      const movie = await this.movieRepository.createNewMovie({
        title,
        releaseYear,
      });
      console.log('1');
      return movie;
    } catch (error) {
      console.log('2');
      throw new HttpException(
        { message: error },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  updateMovie(id: string, movie) {
    const updatedMovie = this.movieRepository.updateMovie(id, movie);
    return updatedMovie;
  }

  removeMovie(id: string) {
    this.movieRepository.removeMovie(id);
  }
}
