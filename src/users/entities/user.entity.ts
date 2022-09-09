import { Content } from 'src/types';
import { Entity, Column, OneToMany, JoinColumn } from 'typeorm';
import { IsDefined, IsEmail, Length } from 'class-validator';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';

@Entity()
export class User extends Content {
  @Column({ unique: true })
  @IsDefined()
  @Length(2, 30)
  public username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @Length(2, 200)
  public about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  public avatar: string;

  @Column({ unique: true })
  @IsEmail()
  public email: string;

  @Column()
  public password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  public wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  public offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  public wishlists: Wishlist[];
}
