import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './resources/users/users.module';
import { User } from './resources/users/entities/user.entity';
import { Wish } from './resources/wishes/entities/wish.entity';
import { Wishlist } from './resources/wishlists/entities/wishlist.entity';
import { Offer } from './resources/offers/entities/offer.entity';
import { WishesModule } from './resources/wishes/wishes.module';
import { WishlistsModule } from './resources/wishlists/wishlists.module';
import { OffersModule } from './resources/offers/offers.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EmailSenderModule } from './email-sender/email-sender.module';
import configs from './config/configuration';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: configs().db.host,
      port: configs().db.port,
      username: configs().db.username,
      password: configs().db.password,
      database: configs().db.databaseName,
      entities: [User, Wish, Wishlist, Offer],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      load: [configs],
    }),
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
    AuthModule,
    EmailSenderModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
