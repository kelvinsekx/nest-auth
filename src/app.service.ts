import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly mailService: MailerService) {}

  async sendMail() {
    const message = `Forgot your password? If you didn't forget your password, please ignore this email!`;

    await this.mailService.sendMail({
      to: 'joanna@gmail.com',
      subject: `How to Send Emails with Nodemailer`,
      html: `<p>${message}</p>`,
    });
  }

  async sendMailWithTemplate() {
    await this.mailService.sendMail({
      from: 'Kingsley Okure <kingsleyokgeorge@gmail.com>',
      to: 'joanna@gmail.com',
      subject: `How to Send Emails with Nodemailer`,
      template: 'example',
      context: {
        code: 'cf1a3f828287',
        username: 'john doe',
      },
    });
  }

  getHello(): string {
    return 'Hello World!';
  }
}
