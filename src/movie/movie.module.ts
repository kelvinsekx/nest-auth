import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { MOVIES_REPOSITORY } from 'src/@repository/movies/movies.interface';
import { PrismaMoviesRepository } from 'src/@repository/movies/prisma-movies';
import { PrismaService } from './../@repository/prisma.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [MovieController],
  providers: [
    MovieService,
    PrismaService,
    JwtService,
    {
      provide: MOVIES_REPOSITORY,
      useClass: PrismaMoviesRepository,
    },
  ],
})
export class MovieModule {}
