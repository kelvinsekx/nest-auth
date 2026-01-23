import { Prisma } from 'src/generated/prisma/client';

export const MOVIES_REPOSITORY = 'MOVIES_REPOSITORY';

export interface MoviesRepository {
  getAllMovies(): Promise<Array<Prisma.MovieCreateInput>>;

  getOneMovie(id: string): Promise<Prisma.MovieCreateInput | null>;

  createNewMovie(
    data: Prisma.MovieCreateInput,
  ): Promise<Prisma.MovieCreateInput | never>;

  updateMovie(
    id: string,
    data: Prisma.MovieCreateInput,
  ): Promise<Prisma.MovieCreateInput | never>;

  removeMovie(id: string): Promise<Prisma.MovieCreateInput | never>;
}
