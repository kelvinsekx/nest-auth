import { Module } from '@nestjs/common';
import { RentService } from './rent.service';
import { RentController } from './rent.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UsersService } from 'src/users/users.service';
import { MovieService } from 'src/movie/movie.service';
import { PrismaService } from 'src/@repository/prisma.service';
import { SearchService } from 'src/core/common/services/search.service';
import { PrismaMoviesRepository } from 'src/@repository/movies/prisma-movies';
import { RentalCron } from './rent.cron.jobs.';

@Module({
  controllers: [RentController],
  providers: [
    RentService,
    UsersService,
    PrismaService,
    MovieService,
    SearchService,
    PrismaMoviesRepository,
    RentalCron,
  ],
  imports: [AuthModule],
})
export class RentModule {}
