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

- see list of movies ✅
- search movies ✅
- rent a movie for a defined period ✅
- see `RentalStatus.PENDING` rents ✅
- see `RentalStatus.ACTIVE` rents ✅
- see `RentalStatus.RETURNED` rents ✅
- see `RentalStatus.EXPIRED` rents ✅
- System tracks expiration of `ACTIVE` movies ✅
- System tracks `PENDING` rents, after 1 hour turns them to active if moderator hasn't perform any action. ✅
- User may return or extend rental ✅
- Rental auto-expires if overdue

## Review & moderation system

- User submit review
- Review enters pending state
- moderator approves or rejects
- user is notified of outcome

## API Endpoints

Below is a concise list of implemented endpoints grouped by feature. Protected endpoints require `Authorization: Bearer <token>` (JWT).

### App (misc)
| Endpoint | Method | Auth | Description | Notes |
|---|---:|---:|---|---|
| `/` | GET | No | Health / welcome | Returns a greeting string |
| `/send-email` | GET | No | Trigger test email (dev) | Returns mail result and success message |

### Authentication
| Endpoint | Method | Auth | Description | Body / Query |
|---|---:|---:|---|---|
| `/auth/signup` | POST | No | Register new user | `CreateUserDto` |
| `/auth/login` | POST | No | Authenticate user, returns JWT | `LoginUserDto` |
| `/auth/verify` | POST | No | Verify user email/token | `VerifyUserDto` |
| `/auth/request-reset` | GET | No | Request password reset email | `?email=<address>` |
| `/auth/confirm-reset-token` | POST | No | Confirm reset token | `{ token: string }` |
| `/auth/reset-password` | POST | No | Reset password using token | `PasswordReset` DTO |
| `/auth/profile` | GET | Yes | Get current user's profile | - |

### Movies
| Endpoint | Method | Auth | Description | Body / Query |
|---|---:|---:|---|---|
| `/movies` | GET | No | List all available movies | optional pagination handled internally |
| `/movies/search` | GET | No | Search movies | `?q=<query>&page=<n>&limit=<n>` |
| `/movies/:id` | GET | Yes | Get movie details by id | `:id` param |
| `/movies` | POST | Yes | Create a new movie | `CreateMovieDto` (includes user association) |
| `/movies/:id` | PUT | Yes | Update movie by id | `UpdateMovieDTO` |
| `/movies/:id` | DELETE | No | Remove movie (204) | returns HTTP 204 on success |

### Rentals
All `/rent` endpoints are protected by JWT (class-level guard).
| Endpoint | Method | Auth | Description | Body / Query |
|---|---:|---:|---|---|
| `/rent` | POST | Yes | Create a rent entry | `CreateRentDto` |
| `/rent` | GET | Yes | List rents for current user (filter by status) | `?status=PENDING|ACTIVE|RETURNED|EXPIRED` |
| `/rent/return` | POST | Yes | Return a rented movie | `{ rentId: string }` in body |
| `/rent/:id` | POST | Yes | Update / review a rent | `UpdateRentDto` |
| `/rent/:id` | DELETE | Yes | Remove a rent by id | `:id` param |

### Admin
All `/admin` endpoints require an authenticated admin user (`JwtAuthGuard` + `RolesGuard`).
| Endpoint | Method | Auth | Description | Body / Query |
|---|---:|---:|---|---|
| `/admin` | POST | Yes (admin) | Create a super admin | `CreateAdminDto` |
| `/admin` | GET | Yes (admin) | List all admin users | - |
| `/admin/:id` | GET | Yes (admin) | Get admin by id | `:id` param |
| `/admin/:id` | PATCH | Yes (admin) | Update admin by id | `UpdateAdminDto` |
| `/admin/:id` | DELETE | Yes (admin) | Remove admin by id | `:id` param |

Notes:
- DTO types referenced above live in the corresponding `src/*` feature folders (for example `src/movie/movie.dto.ts`).
- Use `Authorization: Bearer <token>` for protected routes. Swagger tags are present on some controllers for additional API docs if Swagger is enabled.

## Examples (curl)

Replace `BASE_URL` with your server address (default `http://localhost:3000`). Replace `$TOKEN` and `$ADMIN_TOKEN` with tokens returned from `/auth/login` for regular and admin users respectively.

### Authentication
```bash
# Sign up
curl -X POST "${BASE_URL:-http://localhost:3000}/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"Password1!","name":"Alice"}'

# Login (returns access token)
curl -X POST "${BASE_URL:-http://localhost:3000}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"Password1!"}'

# Get profile (protected)
curl "${BASE_URL:-http://localhost:3000}/auth/profile" \
  -H "Authorization: Bearer $TOKEN"
```

### Movies
```bash
# List movies
curl "${BASE_URL:-http://localhost:3000}/movies"

# Search movies
curl "${BASE_URL:-http://localhost:3000}/movies/search?q=inception&page=1&limit=10"

# Get movie details (protected)
curl "${BASE_URL:-http://localhost:3000}/movies/<MOVIE_ID>" \
  -H "Authorization: Bearer $TOKEN"

# Create a movie (protected)
curl -X POST "${BASE_URL:-http://localhost:3000}/movies" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Inception","description":"A mind-bending thriller","releaseYear":2010}'

# Update a movie (protected)
curl -X PUT "${BASE_URL:-http://localhost:3000}/movies/<MOVIE_ID>" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Inception (Edited)"}'

# Delete a movie
curl -X DELETE "${BASE_URL:-http://localhost:3000}/movies/<MOVIE_ID>"
```

### Rentals (all protected)
```bash
# Create a rent
curl -X POST "${BASE_URL:-http://localhost:3000}/rent" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"movieId":"<MOVIE_ID>","period":7}'

# List rents (filter by status)
curl "${BASE_URL:-http://localhost:3000}/rent?status=ACTIVE" \
  -H "Authorization: Bearer $TOKEN"

# Return a rent
curl -X POST "${BASE_URL:-http://localhost:3000}/rent/return" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"rentId":"<RENT_ID>"}'

# Update/review a rent
curl -X POST "${BASE_URL:-http://localhost:3000}/rent/<ID>" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"comment":"Looks good","status":"ACTIVE"}'

# Delete a rent
curl -X DELETE "${BASE_URL:-http://localhost:3000}/rent/<ID>" \
  -H "Authorization: Bearer $TOKEN"
```

### Admin (admin-only)
```bash
# Create a super admin (requires admin role)
curl -X POST "${BASE_URL:-http://localhost:3000}/admin" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"AdminPass1!","name":"Admin"}'

# List admins
curl "${BASE_URL:-http://localhost:3000}/admin" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

Notes:
- The exact DTO property names (for example `CreateUserDto`, `CreateMovieDto`, `CreateRentDto`) are defined in `src/*` folders — adapt JSON bodies to match those DTOs when testing.
- If you enable Swagger in development, it will provide interactive docs for payload shapes and responses.

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
