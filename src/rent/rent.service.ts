import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { VerboseRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/@repository/prisma.service';
import { VALID_RENTAL_STATUS } from 'src/core/constants';

@Injectable()
export class RentService {
  private readonly logger = new Logger(RentService.name);

  constructor(
    private userService: UsersService,
    private prismaService: PrismaService,
  ) {}

  async create(createRentDto: VerboseRentDto) {
    const user = await this.userService.findOne({ id: createRentDto.userId });
    if (!user) throw new UnauthorizedException('Login to rent a movie');

    const DateToRentMovie = createRentDto.rentedAt,
      DateToReturnMovie = createRentDto.dueAt,
      today = new Date().toISOString();

    if (DateToRentMovie > DateToReturnMovie) {
      throw new BadRequestException(
        "Please choose a rent date that does't come after the return date",
      );
    }

    if (DateToRentMovie < today) {
      throw new BadRequestException('Rent date can not be in the past');
    }

    await this.prismaService.$transaction(async (tx) => {
      const movie = await tx.movie.findUnique({
        where: { id: createRentDto.movieId },
      });

      if (!movie) throw new BadRequestException("Movie don't exist");

      const overlappingRental = await tx.rental.findFirst({
        where: {
          userId: createRentDto.userId,
          movieId: createRentDto.movieId,
          dueAt: {
            gte: createRentDto.rentedAt,
          },
        },
      });

      if (overlappingRental)
        throw new BadRequestException(
          'You have an overlapping rent for same movie.',
        );

      await tx.rental.create({
        data: {
          movieId: movie.id,
          rentedAt: createRentDto.rentedAt,
          dueAt: createRentDto.dueAt,
          userId: createRentDto.userId,
        },
      });
    });

    //TODO: Send an email

    return { message: 'Your rent was successfully' };
  }

  async findAll(userId, status) {
    if (!VALID_RENTAL_STATUS.includes(status))
      throw new BadRequestException(status + ' is not a valid rental status.');
    return await this.prismaService.rental.findMany({
      where: {
        userId,
        status,
      },
    });
  }

  async returnMovie({ rentId, userId }: { rentId: string; userId: string }) {
    if (!rentId) throw new BadRequestException('Rental ID is required');
    const rentedMovie = await this.prismaService.rental.findFirst({
      where: {
        id: rentId,
        returnedAt: null,
        userId,
      },
    });

    if (!rentedMovie)
      throw new NotFoundException('Rent not found or already returned');

    const now = new Date().toISOString();
    const { userId: _, ...updatedRental } =
      await this.prismaService.rental.update({
        where: { id: rentId },
        data: {
          returnedAt: now,
          status: 'RETURNED',
        },
      });

    return updatedRental;
  }

  async update(id: number, updateRentDto: UpdateRentDto) {
    return `This action updates a #${id} rent`;
  }

  async remove(id: number) {
    return `This action removes a #${id} rent`;
  }

  async activatePendingRentals() {
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
    const result = await this.prismaService.rental.updateMany({
      where: {
        status: 'PENDING',
        updatedAt: {
          lte: fiveDaysAgo,
        },
      },
      data: {
        status: 'ACTIVE',
      },
    });
    this.logger.log(result + ' rows were updated.');
  }
}
