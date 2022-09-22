import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Offer } from 'src/resources/offers/entities/offer.entity';
import { Wish } from 'src/resources/wishes/entities/wish.entity';
import { Wishlist } from 'src/resources/wishlists/entities/wishlist.entity';
import { CommonEntityFields } from 'src/types/CommonEntityFields';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity()
export class User extends CommonEntityFields {
  @Column({ unique: true })
  @IsNotEmpty()
  @Length(1, 64)
  public username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @IsOptional()
  @MaxLength(200)
  public about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  public avatar: string;

  @Column({ unique: true, select: false })
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsNotEmpty()
  @MinLength(2)
  @Column({ select: false })
  public password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  @IsEmpty()
  public wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  @IsEmpty()
  public offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  @IsEmpty()
  public wishlists: Wishlist[];
}
