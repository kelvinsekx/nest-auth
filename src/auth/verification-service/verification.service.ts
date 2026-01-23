import { Injectable } from '@nestjs/common';
import { VerificatonPolicyService } from './verification-policy.service';

@Injectable()
export class VerificationService {
  constructor(private readonly policy: VerificatonPolicyService) {}

  generateCode(email: string): string {
    const overrideCode = this.policy.getOverrideCode(email);
    if (overrideCode) return overrideCode;

    throw new Error('Please use a company domain');
  }

  private generate() {
    /** CODE WILL COME HERE */
  }
}
