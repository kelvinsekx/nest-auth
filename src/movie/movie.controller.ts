import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto, UpdateMovieDTO } from './movie.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@ApiTags('movies')
@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @ApiOkResponse({ description: 'All availbale movies' })
  @Get()
  getAllMovies() {
    console.group('hey');
    return this.movieService.getAllMovies();
  }

  @Get(':id')
  getOneMovie(@Param('id') id: string) {
    return this.movieService.getOneMovie(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createNewMovie(@Body() movie: CreateMovieDto) {
    console.log(movie);
    // return this.movieService.createNewMovie(movie);
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
