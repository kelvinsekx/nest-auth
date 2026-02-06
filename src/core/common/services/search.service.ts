import { Injectable } from '@nestjs/common';
import { TSearchQ } from 'src/@repository/movies/prisma-movies';
import { PrismaService } from 'src/@repository/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async searchAll(query: string) {
    const [movies, users] = await Promise.all([
      this.searchMovies({ query }),
      this.searchUsers({ query }),
    ]);

    return [...movies, ...users];
  }

  async searchMovies({ query, take, skip }: TSearchQ) {
    const movies = await this.prisma.movie.findMany({
      where: {
        title: { contains: query },
      },
      orderBy: { createdAt: 'desc' },
      take,
      skip,
    });

    return movies.map((m) => ({
      type: 'movie',
      ...m,
    }));
  }

  async searchUsers({ query, take, skip }: TSearchQ) {
    const users = await this.prisma.user.findMany({
      where: {
        OR: [{ username: { contains: query } }, { email: { contains: query } }],
      },
      take,
      skip,
    });

    return users.map((m) => ({
      type: 'user',
      ...m,
    }));
  }
}
