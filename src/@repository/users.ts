export const USERS_REPOSITORY = 'USERS_REPOSITORY';

export interface UsersRepository {
  findByEmail(
    email: string,
  ): Promise<{ email: string; password: string; userId: string } | null>;
  create(data: { email: string; password: string }): Promise<void>;
}
