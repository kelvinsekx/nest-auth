import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { MOVIES_REPOSITORY } from 'src/@repository/movies.repository';
import { PrismaMoviesRepository } from 'src/@repository/prisma-movies';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [MovieController],
  providers: [
    MovieService,
    PrismaService,
    {
      provide: MOVIES_REPOSITORY,
      useClass: PrismaMoviesRepository,
    },
  ],
})
export class MovieModule {}
