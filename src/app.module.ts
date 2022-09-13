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
import configuration from './config/configuration';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'student',
      password: 'student',
      database: 'kupipodariday',
      entities: [User, Wish, Wishlist, Offer],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      load: [configuration],
    }),
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
