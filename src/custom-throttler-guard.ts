import { Injectable, Logger } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  private readonly logger = new Logger(CustomThrottlerGuard.name);

  protected async getTracker(req: Record<string, any>): Promise<string> {
    const tracker = await super.getTracker(req);
    this.logger.debug(`Throttler Key: ${tracker}`);

    return tracker;
  }
}
