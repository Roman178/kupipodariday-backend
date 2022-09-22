import { createTestAccount, createTransport, Transporter } from 'nodemailer';
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Wish } from 'src/resources/wishes/entities/wish.entity';

@Injectable()
export class EmailSenderService implements OnModuleInit {
  private transporter: Transporter<SentMessageInfo>;
  private testEmailAccount: any;

  constructor(private readonly configService: ConfigService) {}

  public async onModuleInit(): Promise<void> {
    this.testEmailAccount = await createTestAccount();
    this.transporter = createTransport({
      // host: this.configService.get('emailDistributionSMTPT.host'),
      // port: this.configService.get('emailDistributionSMTPT.port'),
      // secure: true,
      host: this.configService.get('emailDistributionSMTPT.testHost'),
      port: this.configService.get('emailDistributionSMTPT.testPort'),
      secure: false,
      auth: {
        // user: this.configService.get('emailDistributionSMTPT.email'),
        // pass: this.configService.get('emailDistributionSMTPT.password'),
        user: this.testEmailAccount.user,
        pass: this.testEmailAccount.pass,
      },
    });
  }

  public async sendEmail(wish: Wish, to: string[]) {
    const result = await this.transporter.sendMail({
      from: `КупиПодариДай Сервис <${this.configService.get<string>(
        'emailYandex',
      )}>`,
      to,
      subject: 'Собрали денег на подарок',
      text: 'Собрали денег на подарок',
      html: `
        <div>
          <a href="${wish.link}">Ссылка на подарок</a>
          <img src="${wish.image}">
        </div>
        <div>
          <p>Контакты кто скинулся:</p>
          ${to.join(', ')}
        </div>
      `,
    });

    return result;
  }
}
