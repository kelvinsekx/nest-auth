import { Injectable, Logger } from '@nestjs/common';
import { RentService } from './rent.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class RentalCron {
  private readonly logger = new Logger(RentalCron.name);
  constructor(private readonly rentalService: RentService) {}

  @Cron('*/5 * * * *')
  async handlePendingToActive() {
    await this.rentalService.activatePendingRentals();
    this.logger.log('Cron job executed');
  }
}
