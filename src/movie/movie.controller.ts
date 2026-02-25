import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto, UpdateMovieDTO } from './movie.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/core/common/guards/auth.guard';
import { GetUserId } from 'src/core/decorators';

@ApiTags('movies')
@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @ApiOkResponse({ description: 'All availbale movies' })
  @Get()
  getAllMovies() {
    return this.movieService.getAllMovies();
  }

  @Get('search')
  search(
    @Query()
    { q, page = 1, limit = 10 }: { q: string; page: number; limit: number },
  ) {
    return this.movieService.search({
      query: q,
      skip: (+page - 1) * limit,
      take: +limit,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.movieService.findOne({ id });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createNewMovie(@Body() movie: CreateMovieDto, @GetUserId() userId: string) {
    return this.movieService.createNewMovie({
      ...movie,
      user: {
        connect: { id: userId },
      },
    });
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateMovie(@Param('id') id: string, @Body() movie: UpdateMovieDTO) {
    return this.movieService.updateMovie(id, movie);
  }

  @Delete(':id')
  @HttpCode(204)
  removeMovie(@Param('id') id: string) {
    return this.movieService.removeMovie(id);
  }
}
