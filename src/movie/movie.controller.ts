import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto, UpdateMovieDTO } from './movie.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('movies')
@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @ApiOkResponse({ description: 'All availbale movies' })
  @Get()
  getAllMovies() {
    return this.movieService.getAllMovies();
  }

  @Get(':id')
  getOneMovie(@Param('id') id: string) {
    return this.movieService.getOneMovie(id);
  }

  @Post()
  createNewMovie(@Body() movie: CreateMovieDto) {
    return this.movieService.createNewMovie(movie);
  }

  @Put(':id')
  updateMovie(@Param('id') id: string, @Body() movie: UpdateMovieDTO) {
    return this.movieService.updateMovie(id, movie);
  }

  @Delete(':id')
  @HttpCode(204)
  removeMovie(@Param('id') id: string) {
    return this.movieService.removeMovie(id);
  }
}
