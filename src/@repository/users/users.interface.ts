export const USERS_REPOSITORY = 'USERS_REPOSITORY';

export interface UsersRepository {
  findByEmail({
    email,
  }: {
    email: string;
  }): Promise<{ email: string; password: string; id: string } | null>;
  create(data: { email: string; password: string }): Promise<{ email: string }>;
}
