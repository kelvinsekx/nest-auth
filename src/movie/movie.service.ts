import { Inject, Injectable } from '@nestjs/common';
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

  createNewMovie(movieInput: Prisma.MovieCreateInput) {
    const { title, releaseYear } = movieInput;
    const movie = this.movieRepository.createNewMovie({
      title,
      releaseYear,
    });
    return movie;
  }

  updateMovie(id: string, movie) {
    const updatedMovie = this.movieRepository.updateMovie(id, movie);
    return updatedMovie;
  }

  removeMovie(id: string) {
    this.movieRepository.removeMovie(id);
  }
}
