import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { RentService } from './rent.service';
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';
import { JwtAuthGuard } from 'src/core/common/guards/auth.guard';
import { GetUserId } from 'src/core/decorators';

@Controller('rent')
@UseGuards(JwtAuthGuard)
export class RentController {
  constructor(private rentService: RentService) {}

  @Post()
  create(@Body() createRentDto: CreateRentDto, @GetUserId() userId: string) {
    return this.rentService.create({ userId, ...createRentDto });
  }

  @Get()
  findAll(@Query('status') status: string, @GetUserId() userId: string) {
    status = status.toUpperCase();
    return this.rentService.findAll(userId, status);
  }

  @Post('return')
  returnRent(@Body('rentId') rentId: string, @GetUserId() userId: string) {
    return this.rentService.returnMovie({ rentId, userId });
  }

  // @Post('extend/:id')
  // extendRent(@Param('id') id: string) {
  //   return this.rentService.findOne(+id);
  // }

  @Post(':id')
  reviewRent(@Param('id') id: string, @Body() updateRentDto: UpdateRentDto) {
    return this.rentService.update(+id, updateRentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rentService.remove(+id);
  }
}
