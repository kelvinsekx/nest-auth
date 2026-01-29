import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { JwtModule } from '@nestjs/jwt';

import { MailerModule } from '@nestjs-modules/mailer';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { SupabaseModule } from './core/supabase/supabase.module';

import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { MovieModule } from './movie/movie.module';

import { UsersService } from './@repository/users/prisma-users';
import { PrismaService } from './@repository/prisma.service';
import { PendingUserService } from './auth/other-services/pending-user.service';
import { VerificationService } from './auth/verification-service/verification.service';
import { VerificatonPolicyService } from './auth/verification-service/verification-policy.service';
import { VerifyPasswordResetRepository } from './auth/other-services/reset-password.service';
import { PasswordService } from './auth/other-services/password.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    SupabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    }),
    MovieModule,
    UsersModule,
  ],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    PrismaService,
    UsersService,
    PendingUserService,
    VerificationService,
    VerificatonPolicyService,
    PasswordService,
    VerifyPasswordResetRepository,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },

    AuthService,
  ],
  exports: [UsersService],
})
export class AppModule {}
