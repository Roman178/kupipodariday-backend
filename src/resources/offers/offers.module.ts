import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { WishesModule } from '../wishes/wishes.module';
import { EmailSenderModule } from 'src/email-sender/email-sender.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [OffersController],
  providers: [OffersService],
  imports: [
    TypeOrmModule.forFeature([Offer]),
    WishesModule,
    EmailSenderModule,
    UsersModule,
  ],
})
export class OffersModule {}
