import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/send-email')
  async sendMailer() {
    const mail = await this.appService.sendMail();

    return {
      message: 'success',
      mail,
    };
  }

  @Get('/send-email-with-template')
  async sendMailWithTemplate() {
    const mail = await this.appService.sendMailWithTemplate();

    return {
      message: 'success',
      mail,
    };
  }
}
