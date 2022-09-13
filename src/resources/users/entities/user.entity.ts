import { Offer } from 'src/resources/offers/entities/offer.entity';
import { Wish } from 'src/resources/wishes/entities/wish.entity';
import { Wishlist } from 'src/resources/wishlists/entities/wishlist.entity';
import { Content } from 'src/types';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity()
export class User extends Content {
  @Column({ unique: true })
  public username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  public about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  public avatar: string;

  @Column({ unique: true })
  public email: string;

  @Column({ select: false })
  // @Column()
  public password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  public wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  public offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  public wishlists: Wishlist[];
}
