import type { InputMovie, Movie } from 'src/movie/movie.interface';

export const MOVIES_REPOSITORY = 'MOVIES_REPOSITORY';

export interface MoviesRepository {
  getAllMovies(): Promise<Array<Movie>>;
  getOneMovie(id: number): Promise<Movie | null>;
  createNewMovie(data: InputMovie): Promise<Movie | never>;
  updateMovie(id: number, data: Movie): Promise<Movie | never>;
  removeMovie(id: number): Promise<Movie | never>;
}
