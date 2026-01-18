import { Inject, Injectable } from '@nestjs/common';
import type { InputMovie } from './movie.interface';
import {
  MOVIES_REPOSITORY,
  type MoviesRepository,
} from 'src/@repository/movies/movies.interface';

@Injectable()
export class MovieService {
  constructor(
    @Inject(MOVIES_REPOSITORY)
    private movieRepository: MoviesRepository,
  ) {}

  getAllMovies() {
    return this.movieRepository.getAllMovies();
  }

  getOneMovie(id: number) {
    return this.movieRepository.getOneMovie(id);
  }

  createNewMovie(movieInput: InputMovie) {
    const { title, year } = movieInput;
    const movie = this.movieRepository.createNewMovie({
      title,
      year,
    });
    return movie;
  }

  updateMovie(id: string, movie) {
    const updatedMovie = this.movieRepository.updateMovie(parseInt(id), movie);
    return updatedMovie;
  }

  removeMovie(id: string) {
    this.movieRepository.removeMovie(parseInt(id));
  }
}
