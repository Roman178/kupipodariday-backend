import { IsUrl, Length } from 'class-validator';
import { Content } from 'src/types';
import { User } from 'src/resources/users/entities/user.entity';
import { Column, JoinColumn, ManyToOne, Entity, OneToMany } from 'typeorm';
import { Offer } from 'src/resources/offers/entities/offer.entity';
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
