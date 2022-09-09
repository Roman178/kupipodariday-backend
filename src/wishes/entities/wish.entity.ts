import { IsUrl, Length } from 'class-validator';
import { Offer } from 'src/offers/entities/offer.entity';
import { Content } from 'src/types';
import { User } from 'src/users/entities/user.entity';
import { Column, JoinColumn, ManyToOne, Entity, OneToMany } from 'typeorm';
@Entity()
export class Wish extends Content {
  @Column()
  @Length(2, 250)
  public name: string;

  @Column()
  @IsUrl()
  public link: string;

  @Column()
  @IsUrl()
  public image: string;

  @Column({ scale: 2, type: 'decimal' })
  public price: number;

  @Column({ scale: 2, type: 'decimal' })
  public raised: number;

  @Column()
  @Length(1, 1024)
  public description: string;

  @Column({ type: 'int' })
  public copied: number;

  @ManyToOne(() => User, (user) => user.wishes)
  public owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  public offers: Offer[];
}
