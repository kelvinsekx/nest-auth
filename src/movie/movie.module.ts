import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { PrismaService } from '../@repository/prisma.service';
import { PrismaMoviesRepository } from 'src/@repository/movies/prisma-movies';
import { AuthModule } from 'src/auth/auth.module';
import { SearchService } from 'src/core/common/services/search.service';

@Module({
  imports: [AuthModule],
  controllers: [MovieController],
  providers: [
    MovieService,
    PrismaService,
    PrismaMoviesRepository,
    SearchService,
  ],
})
export class MovieModule {}
