import crypto from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { VerificatonPolicyService } from './verification-policy.service';

@Injectable()
export class VerificationService {
  constructor(private readonly policy: VerificatonPolicyService) {}

  generateCode(email: string, type: 'signup' | 'reset' = 'signup'): string {
    const overrideCode = this.policy.getOverrideCode(email);
    if (type == 'signup' && overrideCode) return overrideCode;

    return this.generate();
  }

  private generate() {
    return parseInt(crypto.randomBytes(8).toString('hex'), 16)
      .toString()
      .slice(0, 4)
      .padStart(4, '1');
  }
}
