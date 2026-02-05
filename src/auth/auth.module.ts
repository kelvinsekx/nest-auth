import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from 'src/@repository/prisma.service';
import { UsersService } from 'src/@repository/users/prisma-users';
import { VerificationService } from './verification-service/verification.service';
import { VerificatonPolicyService } from './verification-service/verification-policy.service';
import { PasswordService } from './other-services/password.service';
import { PendingUserService } from './other-services/pending-user.service';
import { VerifyPasswordResetRepository } from './other-services/reset-password.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {

        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '1d' },
        };
      },
    }),
  ],
  providers: [
    PrismaService,
    UsersService,
    PendingUserService,
    VerificationService,
    VerificatonPolicyService,
    PasswordService,
    VerifyPasswordResetRepository,
    AuthService,
  ],
  controllers: [AuthController],
  exports: [JwtModule]
})
export class AuthModule {}
