<h1 align="center" size="200px">
  Reent (movie rental & review platform)
</h1>
<p align="center">A backend-focused platform that demonstrates real-world system design: authentication, rentals, reviews, admin moderation, transactional workflows and event-driven email notifications</p>

### Roles

- `USER` - Rent movies, submit reviews
- `MODERATOR` - Review approval/rejection
- `ADMIN` - Full system access

### Rental Status

- `PENDING`
- `ACTIVE`
- `RETURNED | EXPIRED`

## Movie rental system

### Authentication & user management

- user signup & login ✅
- user verification ✅
- user verification with email verification
- secure login with JWT ✅
- password reset ✅
- password reset with email
- role-based permissions ✅

### USER Role can

`

- see list of movies ✅
- search movies ✅
- rent a movie for a defined period
- see `RentalStatus.PENDING` rents
- see `RentalStatus.ACTIVE` rents
- see `RentalStatus.RETURNED` rents
- see `RentalStatus.EXPIRED` rents
- System tracks expiration of `ACTIVE` movies
- User may return or extend rental
- Rental auto-expires if overdue

## Review & moderation system

- User submit review
- Review enters pending state
- moderator approves or rejects
- user is notified of outcome

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Resources

- Visit the [Lantern Pages Documentation](https://docs.nestjs.com) to learn more about the framework.

## Supabase Setup

To enable Supabase in this project:

1. Create a Supabase project at https://app.supabase.com and copy the Project URL and anon or service role key.
2. Create a `.env` file from the included `.env.example` and set `SUPABASE_URL` and `SUPABASE_KEY`.

```bash
cp .env.example .env
# edit .env and set SUPABASE_URL and SUPABASE_KEY
```

3. Install dependencies and start the server:

```bash
npm install
npm run start:dev
```

4. The app provides a global `SupabaseService` you can inject and call `getClient()` to access the Supabase client.

## Stay in touch

- Author - [Kelvinsekx](https://twitter.com/kelvinsekx)
- Website - [https://nestjs.com](https://nestjs.com/)

## License

WGAF
