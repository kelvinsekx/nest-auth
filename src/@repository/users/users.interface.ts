export const USERS_REPOSITORY = 'USERS_REPOSITORY';

export abstract class UsersRepository {
  abstract findByEmail({
    email,
  }: {
    email: string;
  }): Promise<{ email: string; passwordHash: string; id: string } | null>;

  abstract create(data: {
    email: string;
    passwordHash: string;
  }): Promise<{ email: string }>;
}
