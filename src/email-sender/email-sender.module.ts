import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailSenderService } from './email-sender.service';

@Module({
  providers: [EmailSenderService],
  imports: [ConfigModule],
  exports: [EmailSenderService],
})
export class EmailSenderModule {}
