import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VerificatonPolicyService {
  constructor(private readonly config: ConfigService) {}
  getOverrideCode(email: string) {
    const enabled = this.config.get<boolean>('VERIFICATION_OVERRIDE_ENABLED');

    if (!enabled) return null;

    const allowedDomain = this.config.get<string>(
      'VERIFICATION_OVERRIDE_DOMAIN',
    );

    const emailDomain = email.split('@')[1]?.toLowerCase();

    if (allowedDomain !== emailDomain) return null;

    return this.config.get<string>('VERIFICATION_OVERRIDE_CODE');
  }
}
