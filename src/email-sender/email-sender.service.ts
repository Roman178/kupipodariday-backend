import { createTestAccount, createTransport, Transporter } from 'nodemailer';
import { SentMessageInfo } from 'nodemailer/lib/smtp-transport';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Wish } from 'src/resources/wishes/entities/wish.entity';

@Injectable()
export class EmailSenderService implements OnModuleInit {
  private _transporter: Transporter<SentMessageInfo>;
  private _testEmailAccount: any;

  constructor(private readonly _configService: ConfigService) {}

  public async onModuleInit(): Promise<void> {
    this._testEmailAccount = await createTestAccount();
    this._transporter = createTransport({
      // host: 'smtp.yandex.ru',
      // port: 465,
      // secure: true,
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        // Яндекс родной заблочил на сутки за исходящий спам.
        // user: this._configService.get<string>('emailYandex'),
        // pass: this._configService.get<string>('passwordEmailYandex'),
        user: this._testEmailAccount.user,
        pass: this._testEmailAccount.pass,
      },
    });
  }

  public async sendEmail(wish: Wish, to: string[]) {
    const result = await this._transporter.sendMail({
      from: `КупиПодариДай Сервис <${this._configService.get<string>(
        'emailYandex',
      )}>`,
      to: ['ismagilov771@gmail.com', 'ismagilov_roman@mail.ru'],
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
